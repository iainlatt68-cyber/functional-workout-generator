/* ===============================
   Functional Workout Generator
   Full-screen workout mode + progress + animations + wake lock
   =============================== */

document.addEventListener("DOMContentLoaded", init);

/* ---------- STATE ---------- */
let workout = [];            // flattened, equipment-grouped
let currentIndex = 0;
let restTimer = null;
let wakeLockSentinel = null; // Screen Wake Lock API

/* ---------- EXERCISE POOLS ---------- */
const EXERCISES = {
  kettlebell: [
    "Kettlebell Swing",
    "Goblet Squat",
    "Clean & Press",
    "Racked Reverse Lunge",
    "Single-Arm Row",
    "Front Rack Carry"
  ],
  sandbag: [
    "Sandbag Clean",
    "Bear Hug Squat",
    "Sandbag Carry",
    "Sandbag Reverse Lunge",
    "Shoulder Load",
    "Ground-to-Shoulder"
  ],
  bodyweight: [
    "Press-Up",
    "Air Squat",
    "Plank",
    "Burpee",
    "Mountain Climbers",
    "Walking Lunge"
  ]
};

const REST_BY_GOAL = {
  strength: 90,
  conditioning: 45,
  hybrid: 60
};

const REST_ADJUST_BY_DIFFICULTY = {
  easy: -15,
  medium: 0,
  hard: +15
};

/* ---------- ELEMENTS ---------- */
const $ = (id) => document.getElementById(id);

function init() {
  console.log("✅ JS IS RUNNING");

  // Reset UI safely on load
  safeSetText($("previewMeta"), "Generate to see your plan");
  $("workoutList").innerHTML = "";
  $("startBtn").disabled = true;

  // Ensure overlay is hidden on load
  document.body.classList.remove("workout-mode");
  $("workoutOverlay").setAttribute("aria-hidden", "true");
  $("cardHost").innerHTML = "";

  $("generateBtn").addEventListener("click", generateWorkout);
  $("startBtn").addEventListener("click", startWorkout);
  $("exitBtn").addEventListener("click", exitWorkout);

  // Auto-release/reacquire wake lock on visibility changes (recommended pattern)
  document.addEventListener("visibilitychange", async () => {
    // If user leaves tab, browser may release wake lock automatically.
    // When they return, reacquire if we're still in workout mode.
    if (document.visibilityState === "visible" && document.body.classList.contains("workout-mode")) {
      await requestWakeLock();
    } else if (document.visibilityState !== "visible") {
      await releaseWakeLock();
    }
  });
}

/* ---------- GENERATION ---------- */
function generateWorkout() {
  clearRest();

  const goal = $("goal").value;
  const difficulty = $("difficulty").value;
  const perEquipment = clamp(Number($("perEquipment").value || 3), 1, 5);
  const equipment = Array.from($("equipment").selectedOptions).map(o => o.value);

  workout = [];
  currentIndex = 0;

  if (equipment.length === 0) {
    safeSetText($("previewMeta"), "Select at least one equipment option");
    $("startBtn").disabled = true;
    $("workoutList").innerHTML = "";
    return;
  }

  // Build in equipment blocks to minimize kit switching
  equipment.forEach(eq => {
    const pool = (EXERCISES[eq] || []).slice();
    shuffle(pool);

    const chosen = pool.slice(0, perEquipment).map(name => ({
      name,
      equipment: eq,
      rest: adjustRest(REST_BY_GOAL[goal] ?? 60, difficulty),
      goal
    }));

    workout.push(...chosen);
  });

  renderPreview(equipment, perEquipment, goal, difficulty);
  $("startBtn").disabled = workout.length === 0;
}

/* ---------- PREVIEW RENDER (equipment-grouped) ---------- */
function renderPreview(equipment, perEquipment, goal, difficulty) {
  const list = $("workoutList");
  list.innerHTML = "";

  safeSetText(
    $("previewMeta"),
    `${workout.length} exercises • ${goal} • ${difficulty} • ${perEquipment} per equipment`
  );

  // Group by equipment while preserving order
  equipment.forEach(eq => {
    const block = document.createElement("div");
    block.className = "block";

    const title = document.createElement("div");
    title.className = "blockTitle";
    title.innerHTML = `<strong>${labelEquipment(eq)}</strong><span class="tag">${perEquipment} moves</span>`;
    block.appendChild(title);

    workout
      .filter(x => x.equipment === eq)
      .forEach((ex, idx) => {
        const row = document.createElement("div");
        row.className = "item";
        row.innerHTML = `
          <div class="name">${idx + 1}. ${ex.name}</div>
          <div class="meta">Rest ${ex.rest}s</div>
        `;
        block.appendChild(row);
      });

    list.appendChild(block);
  });
}

/* ---------- WORKOUT MODE (FULL SCREEN) ---------- */
async function startWorkout() {
  if (!workout || workout.length === 0) return;

  clearRest();
  currentIndex = 0;

  // Enter full-screen overlay mode
  document.body.classList.add("workout-mode");
  $("workoutOverlay").setAttribute("aria-hidden", "false");

  await requestWakeLock(); // keep screen awake during workout [3](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/wakeLock)[4](https://developer.chrome.com/docs/capabilities/web-apis/wake-lock)

  renderExerciseCard();
}

function exitWorkout() {
  clearRest();
  releaseWakeLock();

  document.body.classList.remove("workout-mode");
  $("workoutOverlay").setAttribute("aria-hidden", "true");
  $("cardHost").innerHTML = "";

  // Keep generated workout preview; user can re-start
  updateProgressUI("Ready");
}

/* ---------- CARD RENDERING ---------- */
function renderExerciseCard() {
  clearRest();

  if (currentIndex >= workout.length) {
    renderFinishCard();
    return;
  }

  const ex = workout[currentIndex];
  updateProgressUI("Exercise");

  const card = document.createElement("div");
  card.className = "card animateIn";
  card.innerHTML = `
    <h2>${escapeHtml(ex.name)}</h2>
    <p class="subline">${labelEquipment(ex.equipment)} • Goal: ${escapeHtml(ex.goal)}</p>
    <div class="pillRow">
      <div class="pill">Tap to complete</div>
      <div class="pill">Rest: ${ex.rest}s</div>
    </div>
    <div class="tapHint">Tap anywhere on this card to start rest</div>
  `;

  // Tap to complete -> start rest
  card.addEventListener("click", () => startRest(ex.rest), { once: true });

  mountCard(card);
}

function startRest(seconds) {
  updateProgressUI("Rest");

  let remaining = Math.max(5, Number(seconds) || 60);

  const card = document.createElement("div");
  card.className = "card animateIn pulse";
  card.innerHTML = `
    <h2>Rest</h2>
    <div class="bigNumber" id="restNumber">${remaining}</div>
    <p class="subline">Tap to skip</p>
    <div class="pillRow">
      <div class="pill">Auto-advance at 0</div>
      <div class="pill">${$("goal").value} pacing</div>
    </div>
  `;

  // Tap to skip rest immediately
  card.addEventListener("click", nextExercise, { once: true });

  mountCard(card);

  // Run timer
  restTimer = setInterval(() => {
    remaining -= 1;
    const n = $("restNumber");
    if (n) n.textContent = String(remaining);

    if (remaining <= 0) {
      nextExercise();
    }
  }, 1000);
}

function nextExercise() {
  clearRest();
  currentIndex += 1;
  renderExerciseCard();
}

function renderFinishCard() {
  updateProgressUI("Complete");

  const summary = generateFeedback(workout);

  const card = document.createElement("div");
  card.className = "card animateIn";
  card.innerHTML = `
    <h2>SESSION COMPLETE</h2>
    <p class="subline">${escapeHtml(summary.title)}</p>
    <div class="pillRow">
      <div class="pill">${summary.volume}</div>
      <div class="pill">${summary.bias}</div>
    </div>
    <div class="tapHint">${escapeHtml(summary.note)}</div>
    <div style="margin-top:16px; display:grid; gap:10px;">
      <button id="backBtn" class="btn primary" type="button">Back to Generator</button>
      <button id="restartBtn" class="btn" type="button">Restart This Workout</button>
    </div>
  `;

  mountCard(card);

  // Release wake lock at end
  releaseWakeLock();

  // Buttons
  card.querySelector("#backBtn").addEventListener("click", () => {
    // Clear workout so Start disables until re-generated
    workout = [];
    currentIndex = 0;
    $("startBtn").disabled = true;
    $("workoutList").innerHTML = "";
    safeSetText($("previewMeta"), "Generate to see your plan");
    exitWorkout();
  });

  card.querySelector("#restartBtn").addEventListener("click", async () => {
    currentIndex = 0;
    await requestWakeLock();
    renderExerciseCard();
  });
}

/* ---------- PROGRESS UI ---------- */
function updateProgressUI(modeText) {
  const total = workout.length || 0;
  const idx = Math.min(currentIndex + 1, total);

  safeSetText($("progressCount"), `${total ? idx : 0} / ${total}`);
  safeSetText($("modeLabel"), modeText);

  const pct = total ? Math.round(((idx - 1) / total) * 100) : 0;
  $("progressFill").style.width = `${clamp(pct, 0, 100)}%`;
}

function mountCard(cardEl) {
  const host = $("cardHost");
  host.innerHTML = "";
  host.appendChild(cardEl);
}

/* ---------- WAKE LOCK (keep screen awake) ---------- */
async function requestWakeLock() {
  // Screen Wake Lock API is secure-context only and may not exist in all browsers [3](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/wakeLock)[4](https://developer.chrome.com/docs/capabilities/web-apis/wake-lock)
  try {
    if (!("wakeLock" in navigator) || typeof navigator.wakeLock.request !== "function") {
      return;
    }
    // If already held, do nothing
    if (wakeLockSentinel) return;

    wakeLockSentinel = await navigator.wakeLock.request("screen");
    wakeLockSentinel.addEventListener("release", () => {
      wakeLockSentinel = null;
    });
  } catch (err) {
    // Fail silently; app still works
    wakeLockSentinel = null;
  }
}

async function releaseWakeLock() {
  try {
    if (wakeLockSentinel) {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
  } catch (err) {
    wakeLockSentinel = null;
  }
}

/* ---------- FEEDBACK ---------- */
function generateFeedback(w) {
  const n = w.length;

  const equipCounts = w.reduce((acc, x) => {
    acc[x.equipment] = (acc[x.equipment] || 0) + 1;
    return acc;
  }, {});

  const topEquip = Object.entries(equipCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || "mixed";

  let title = "Solid session. Recover well.";
  let note = "Next time: add a little load, or shorten rests for density.";
  let volume = n >= 12 ? "High volume" : n >= 8 ? "Medium volume" : "Low volume";
  let bias = `Bias: ${labelEquipment(topEquip)}`;

  if (n >= 12) {
    title = "High workload session.";
    note = "Prioritise sleep, hydration, and an easier day tomorrow.";
  } else if (n <= 6) {
    title = "Short and sharp.";
    note = "Great for consistency — repeat and progress load or tempo.";
  }

  return { title, note, volume, bias };
}

/* ---------- UTILITIES ---------- */
function adjustRest(base, difficulty) {
  const adj = REST_ADJUST_BY_DIFFICULTY[difficulty] ?? 0;
  return clamp(base + adj, 20, 180);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function labelEquipment(eq) {
  if (eq === "kettlebell") return "Kettlebell";
  if (eq === "sandbag") return "Sandbag";
  if (eq === "bodyweight") return "Bodyweight";
  return "Mixed";
}

function safeSetText(el, txt) {
  if (el) el.textContent = txt;
}

function clearRest() {
  if (restTimer) {
    clearInterval(restTimer);
    restTimer = null;
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
