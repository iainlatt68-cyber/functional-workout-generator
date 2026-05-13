console.log("✅ app.js loaded");

/* ==============================
   STATE (single source of truth)
   ============================== */
const state = {
  goal: "hypertrophy",
  difficulty: "intermediate",
  equipment: "fullgym",
  time: 30
};

let workout = [];      // array of steps (exercise/rest/finish)
let stepIndex = 0;
let restTimer = null;

/* ==============================
   EXERCISE POOLS
   ============================== */
const POOLS = {
  dumbbells: [
    { name: "DB Goblet Squat", tags: ["lower"] },
    { name: "DB Romanian Deadlift", tags: ["hinge"] },
    { name: "DB Bench / Floor Press", tags: ["push"] },
    { name: "DB One-Arm Row", tags: ["pull"] },
    { name: "DB Split Squat", tags: ["lower"] },
    { name: "DB Shoulder Press", tags: ["push"] },
    { name: "DB Lateral Raise", tags: ["shoulders"] },
    { name: "DB Farmer Carry", tags: ["carry"] }
  ],
  kettlebell: [
    { name: "KB Swing", tags: ["hinge"] },
    { name: "KB Goblet Squat", tags: ["lower"] },
    { name: "KB Clean & Press", tags: ["push"] },
    { name: "KB One-Arm Row", tags: ["pull"] },
    { name: "KB Racked Reverse Lunge", tags: ["lower"] },
    { name: "KB Halo", tags: ["mobility"] },
    { name: "Suitcase Carry", tags: ["carry"] }
  ],
  sandbag: [
    { name: "Sandbag Clean", tags: ["power"] },
    { name: "Bear Hug Squat", tags: ["lower"] },
    { name: "Sandbag Carry", tags: ["carry"] },
    { name: "Ground-to-Shoulder", tags: ["power"] },
    { name: "Sandbag Reverse Lunge", tags: ["lower"] },
    { name: "Sandbag Row", tags: ["pull"] }
  ],
  fullgym: [
    { name: "Back Squat", tags: ["lower"] },
    { name: "Deadlift / Trap Bar Deadlift", tags: ["hinge"] },
    { name: "Bench Press", tags: ["push"] },
    { name: "Row (Cable/Bar/DB)", tags: ["pull"] },
    { name: "Overhead Press", tags: ["push"] },
    { name: "Lat Pulldown / Pull-ups", tags: ["pull"] },
    { name: "Walking Lunges", tags: ["lower"] },
    { name: "Sled Push / Bike", tags: ["conditioning"] }
  ]
};

/* ==============================
   DOM
   ============================== */
const $ = (id) => document.getElementById(id);

const previewList = $("previewList");
const meta = $("meta");
const generateBtn = $("generate");
const startBtn = $("start");

const workoutScreen = $("workoutScreen");
const workoutCard = $("workoutCard");
const exitWorkoutBtn = $("exitWorkout");
const progressText = $("progressText");
const progressFill = $("progressFill");

/* ==============================
   BUTTON UI -> STATE WIRING
   ============================== */
document.querySelectorAll(".button-row").forEach(row => {
  const group = row.dataset.group;

  row.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      // single select groups: clear then set
      row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const value = btn.dataset.value;
      state[group] = (group === "time") ? Number(value) : value;

      // Helpful for debugging
      console.log("STATE:", { ...state });
    });
  });
});

/* ==============================
   EVENTS
   ============================== */
generateBtn.addEventListener("click", generateWorkout);
startBtn.addEventListener("click", startWorkout);
exitWorkoutBtn.addEventListener("click", exitWorkout);

/* ==============================
   GENERATION RULES
   ============================== */
const EXERCISE_COUNT_BY_TIME = {
  15: 4,
  30: 7,
  45: 10,
  60: 12,
  90: 16
};

// Rest targets (seconds) by goal (baseline)
const REST_BY_GOAL = {
  strength: 120,
  hypertrophy: 75,
  conditioning: 25,
  recovery: 45,
  mobility: 20
};

// Difficulty rest adjustments (seconds)
const REST_ADJ_BY_DIFFICULTY = {
  beginner: +25,
  intermediate: 0,
  advanced: -10,
  elite: -15
};

function prescriptionFor(goal, difficulty, time) {
  // Return short instruction string shown in preview/workout
  const intensity = difficulty === "beginner" ? "RPE 6" :
                    difficulty === "intermediate" ? "RPE 7" :
                    difficulty === "advanced" ? "RPE 8" : "RPE 9";

  if (goal === "strength") return `3–5 sets x 3–5 reps • ${intensity}`;
  if (goal === "hypertrophy") return `3–4 sets x 8–12 reps • ${intensity}`;
  if (goal === "conditioning") return `Work 40s / Rest 20s • Move fast`;
  if (goal === "recovery") return `Easy pace • nasal breathing • quality reps`;
  if (goal === "mobility") return `Controlled tempo • 45–60s per movement`;
  return `Work at ${intensity}`;
}

function restFor(goal, difficulty) {
  const base = REST_BY_GOAL[goal] ?? 60;
  const adj = REST_ADJ_BY_DIFFICULTY[difficulty] ?? 0;
  return clamp(base + adj, 10, 180);
}

/* ==============================
   GENERATE WORKOUT
   ============================== */
function generateWorkout() {
  clearRest();

  workout = [];
  stepIndex = 0;

  const { goal, difficulty, equipment, time } = state;

  const pool = (POOLS[equipment] || []).slice();
  if (!pool.length) {
    meta.textContent = "No exercises found for that equipment.";
    previewList.innerHTML = "";
    startBtn.disabled = true;
    return;
  }

  // Pick N exercises, but keep variety (avoid duplicates)
  const n = EXERCISE_COUNT_BY_TIME[time] ?? 7;
  shuffle(pool);
  const chosen = pool.slice(0, Math.min(n, pool.length));

  const presc = prescriptionFor(goal, difficulty, time);
  const rest = restFor(goal, difficulty);

  // Build the workout steps: alternating EXERCISE -> REST -> EXERCISE...
  // Mobility & recovery get shorter rests + a warm-up feel.
  chosen.forEach((ex, i) => {
    workout.push({
      type: "exercise",
      name: ex.name,
      prescription: presc,
      restSeconds: rest
    });

    // Add rest after each exercise except last
    if (i !== chosen.length - 1) {
      workout.push({
        type: "rest",
        seconds: rest
      });
    }
  });

  // End screen
  workout.push({
    type: "finish"
  });

  // Render preview
  meta.textContent = `${goal.toUpperCase()} • ${difficulty.toUpperCase()} • ${labelEquipment(equipment)} • ${time} mins`;
  renderPreview(chosen, presc, rest);

  startBtn.disabled = false;
}

/* ==============================
   PREVIEW
   ============================== */
function renderPreview(chosen, presc, rest) {
  previewList.innerHTML = "";

  chosen.forEach((ex, idx) => {
    const row = document.createElement("div");
    row.className = "preview-item";
    row.innerHTML = `
      <div class="name">${idx + 1}. ${escapeHtml(ex.name)}</div>
      <div class="prescription">${escapeHtml(presc)} • Rest ${rest}s</div>
    `;
    previewList.appendChild(row);
  });
}

/* ==============================
   WORKOUT MODE (FULL SCREEN)
   ============================== */
function startWorkout() {
  if (!workout.length) return;

  clearRest();
  stepIndex = 0;

  workoutScreen.classList.remove("hidden");
  workoutScreen.setAttribute("aria-hidden", "false");

  // prevent background scrolling
  document.body.style.overflow = "hidden";

  renderStep();
}

function exitWorkout() {
  clearRest();

  workoutScreen.classList.add("hidden");
  workoutScreen.setAttribute("aria-hidden", "true");
  workoutCard.innerHTML = "";

  document.body.style.overflow = "";

  // Keep the generated preview; user can start again
  updateProgress();
}

/* ==============================
   STEP RENDERING
   ============================== */
function renderStep() {
  clearRest();
  updateProgress();

  const step = workout[stepIndex];
  if (!step) return;

  if (step.type === "exercise") {
    renderExercise(step);
  } else if (step.type === "rest") {
    renderRest(step.seconds);
  } else {
    renderFinish();
  }
}

function renderExercise(step) {
  workoutCard.innerHTML = `
    <div class="card">
      <h3>${escapeHtml(step.name)}</h3>
      <p class="sub">${escapeHtml(step.prescription)}</p>
      <div class="pills">
        <div class="pill">Rest: ${step.restSeconds}s</div>
        <div class="pill">Tap to start rest</div>
      </div>
      <div class="hint">Tap anywhere to complete this exercise</div>
    </div>
  `;

  // Tap exercise -> go to next step (which should be rest, or finish)
  workoutCard.onclick = () => {
    stepIndex++;
    renderStep();
  };
}

function renderRest(seconds) {
  let remaining = Number(seconds) || 45;

  workoutCard.innerHTML = `
    <div class="card">
      <h3>REST</h3>
      <div class="big" id="restNum">${remaining}</div>
      <p class="sub">Tap to skip</p>
      <div class="pills">
        <div class="pill">Auto-advance at 0</div>
      </div>
    </div>
  `;

  const restNum = document.getElementById("restNum");

  // Tap to skip rest
  workoutCard.onclick = () => {
    stepIndex++;
    renderStep();
  };

  restTimer = setInterval(() => {
    remaining--;
    if (restNum) restNum.textContent = String(remaining);

    if (remaining <= 0) {
      stepIndex++;
      renderStep();
    }
  }, 1000);
}

function renderFinish() {
  const { goal, difficulty, equipment, time } = state;

  workoutCard.innerHTML = `
    <div class="card">
      <h3>SESSION COMPLETE</h3>
      <p class="sub">${escapeHtml(goal)} • ${escapeHtml(difficulty)} • ${escapeHtml(labelEquipment(equipment))} • ${time} mins</p>
      <div class="pills">
        <div class="pill">Nice work</div>
        <div class="pill">Recover well</div>
      </div>
      <div class="hint">Tap Exit to go back to generator</div>
    </div>
  `;

  workoutCard.onclick = null;
}

/* ==============================
   PROGRESS
   ============================== */
function updateProgress() {
  const total = workout.length || 0;

  // Count only exercise steps for display? We'll show step index over total steps.
  const current = Math.min(stepIndex + 1, total);

  progressText.textContent = `${current} / ${total}`;
  const pct = total ? Math.round(((current - 1) / total) * 100) : 0;
  progressFill.style.width = `${clamp(pct, 0, 100)}%`;
}

/* ==============================
   HELPERS
   ============================== */
function clearRest() {
  if (restTimer) {
    clearInterval(restTimer);
    restTimer = null;
  }
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

function labelEquipment(e) {
  if (e === "dumbbells") return "Dumbbells only";
  if (e === "fullgym") return "Full gym";
  if (e === "sandbag") return "Sandbag";
  if (e === "kettlebell") return "Kettlebell";
  return e;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
