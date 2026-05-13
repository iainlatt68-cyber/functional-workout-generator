/* ===============================
   Functional Workout Generator
   Single Source of Truth Script
   =============================== */

document.addEventListener("DOMContentLoaded", init);

/* ---------- GLOBAL STATE ---------- */
let workout = [];
let currentIndex = 0;
let restTimer = null;

/* ---------- DATA ---------- */
const EXERCISES = {
  kettlebell: [
    "Kettlebell Swing",
    "Goblet Squat",
    "Clean & Press",
    "Racked Lunge",
    "Single‑Arm Row"
  ],
  sandbag: [
    "Sandbag Clean",
    "Sandbag Bear Hug Squat",
    "Sandbag Carry",
    "Sandbag Reverse Lunge"
  ],
  bodyweight: [
    "Press‑Up",
    "Air Squat",
    "Plank",
    "Burpee",
    "Mountain Climbers"
  ]
};

const REST_BY_GOAL = {
  strength: 90,
  conditioning: 45,
  hybrid: 60
};

/* ---------- INIT ---------- */
function init() {
  console.log("✅ JS IS RUNNING");

  document.getElementById("generateWorkout")
    ?.addEventListener("click", generateWorkout);

  document.getElementById("startWorkout")
    ?.addEventListener("click", startWorkout);

  disableStart();
}

/* ---------- GENERATE WORKOUT ---------- */
function generateWorkout() {
  const equipment = getValues("equipment");
  const rounds = Number(getValue("rounds", 3));
  const goal = getValue("goal", "hybrid");
  const difficulty = getValue("difficulty", "medium");

  workout = [];
  currentIndex = 0;

  equipment.forEach(eq => {
    const pool = EXERCISES[eq] || [];
    shuffle(pool);

    pool.slice(0, rounds).forEach(name => {
      workout.push({
        name,
        equipment: eq,
        rest: adjustRest(REST_BY_GOAL[goal], difficulty)
      });
    });
  });

  renderWorkoutPreview();
  enableStart();
}

/* ---------- START WORKOUT ---------- */
function startWorkout() {
  if (!workout.length) return;

  document.body.classList.add("workout-mode");
  renderExercise();
}

/* ---------- RENDER ---------- */
function renderWorkoutPreview() {
  const container = document.getElementById("workoutDisplay");
  if (!container) return;

  container.innerHTML = "";

  workout.forEach((ex, i) => {
    const div = document.createElement("div");
    div.className = "exercise-preview";
    div.textContent = `${i + 1}. ${ex.name}`;
    container.appendChild(div);
  });
}

function renderExercise() {
  clearRest();

  const display = document.getElementById("activeWorkout");
  if (!display) return;

  if (currentIndex >= workout.length) {
    renderFinish();
    return;
  }

  const ex = workout[currentIndex];

  display.innerHTML = `
    <div class="exercise-card">
      <h2>${ex.name}</h2>
      <p class="tap-hint">Tap to complete & start rest</p>
    </div>
  `;

  display.onclick = () => startRest(ex.rest);
}

/* ---------- REST ---------- */
function startRest(seconds) {
  const display = document.getElementById("activeWorkout");
  let remaining = seconds;

  display.onclick = null;

  display.innerHTML = `
    <div class="rest-card">
      <h2>Rest</h2>
      <div id="restTimer">${remaining}</div>
      <p>Tap to skip</p>
    </div>
  `;

  restTimer = setInterval(() => {
    remaining--;
    document.getElementById("restTimer").textContent = remaining;

    if (remaining <= 0) nextExercise();
  }, 1000);

  display.onclick = nextExercise;
}

/* ---------- PROGRESSION ---------- */
function nextExercise() {
  clearRest();
  currentIndex++;
  renderExercise();
}

function clearRest() {
  if (restTimer) {
    clearInterval(restTimer);
    restTimer = null;
  }
}

/* ---------- FINISH ---------- */
function renderFinish() {
  const display = document.getElementById("activeWorkout");

  const feedback = generateFeedback();

  display.innerHTML = `
    <div class="finish-screen">
      <h2>SESSION COMPLETE</h2>
      <p>${feedback}</p>
    </div>
  `;
}

/* ---------- FEEDBACK ---------- */
function generateFeedback() {
  const count = workout.length;

  if (count >= 12) return "High volume session – prioritise recovery.";
  if (count >= 8) return "Solid workload with good movement variety.";
  return "Short, sharp session – ideal for consistency.";
}

/* ---------- HELPERS ---------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function adjustRest(base, difficulty) {
  if (difficulty === "easy") return base - 15;
  if (difficulty === "hard") return base + 15;
  return base;
}

function getValue(id, fallback = null) {
  const el = document.getElementById(id);
  return el ? el.value : fallback;
}

function getValues(id) {
  const el = document.getElementById(id);
  if (!el) return [];
  return Array.from(el.selectedOptions).map(o => o.value);
}

function disableStart() {
  const btn = document.getElementById("startWorkout");
  if (btn) btn.disabled = true;
}

function enableStart() {
  const btn = document.getElementById("startWorkout");
  if (btn) btn.disabled = false;
}
