document.addEventListener("DOMContentLoaded", init);

let workout = [];
let currentIndex = 0;
let restTimer = null;

const EXERCISES = {
  kettlebell: [
    "Kettlebell Swing",
    "Goblet Squat",
    "Clean & Press"
  ],
  sandbag: [
    "Sandbag Clean",
    "Bear Hug Squat",
    "Sandbag Carry"
  ],
  bodyweight: [
    "Press‑Up",
    "Air Squat",
    "Plank"
  ]
};

const REST = {
  strength: 90,
  conditioning: 45,
  hybrid: 60
};

function init() {
  console.log("✅ JS IS RUNNING");

  document.getElementById("activeWorkout").innerHTML = "";

  document.getElementById("generateWorkout")
    .addEventListener("click", generateWorkout);

  document.getElementById("startWorkout")
    .addEventListener("click", startWorkout);
}

function generateWorkout() {
  workout = [];
  currentIndex = 0;

  const goal = goalValue();
  const difficulty = difficultyValue();
  const rounds = Number(roundsValue());
  const equipment = equipmentValues();

  equipment.forEach(eq => {
    shuffle(EXERCISES[eq]);
    EXERCISES[eq].slice(0, rounds).forEach(name => {
      workout.push({
        name,
        rest: adjustRest(REST[goal], difficulty)
      });
    });
  });

  renderPreview();
  document.getElementById("startWorkout").disabled = false;
}

function startWorkout() {
  if (!workout.length) return;

  currentIndex = 0;
  clearRest();

  // ✅ ENTER FULL-SCREEN WORKOUT MODE
  document.body.classList.add("workout-mode");

  renderExercise();
}

function renderPreview() {
  const el = document.getElementById("workoutDisplay");
  el.innerHTML = "";
  workout.forEach((e, i) => {
    el.innerHTML += `<div>${i + 1}. ${e.name}</div>`;
  });
}

function renderExercise() {
  clearRest();

  if (currentIndex >= workout.length) {
    renderFinish();
    return;
  }

  const ex = workout[currentIndex];

  const el = document.getElementById("activeWorkout");
  el.innerHTML = `
    <div class="exercise-card">
      <h2>${ex.name}</h2>
      <p class="tap-hint">Tap to complete</p>
    </div>
  `;

  el.onclick = () => startRest(ex.rest);
}

function startRest(seconds) {
  let remaining = seconds;
  const el = document.getElementById("activeWorkout");

  el.innerHTML = `
    <div class="rest-card">
      <h2>Rest</h2>
      <div id="restTimer">${remaining}</div>
      <p>Tap to skip</p>
    </div>
  `;
el.style.pointerEvents = "none";

setTimeout(() => {
  el.style.pointerEvents = "auto";
}, 300);
  restTimer = setInterval(() => {
    remaining--;
    document.getElementById("restTimer").textContent = remaining;
    if (remaining <= 0) next();
  }, 1000);

  el.onclick = next;
}

function next() {
  clearRest();
  currentIndex++;
  renderExercise();
}

function renderFinish() {
  const el = document.getElementById("activeWorkout");

  el.innerHTML = `
    <div class="finish-screen">
      <h2>SESSION COMPLETE</h2>
      <p>Solid work. Recover well.</p>
      <button id="reset">Back to Generator</button>
    </div>
  `;

  document.getElementById("reset").onclick = () => {
    // ✅ EXIT FULL-SCREEN MODE
    document.body.classList.remove("workout-mode");

    workout = [];
    currentIndex = 0;
    clearRest();

    el.innerHTML = "";
    document.getElementById("startWorkout").disabled = true;
  };
}

function clearRest() {
  if (restTimer) {
    clearInterval(restTimer);
    restTimer = null;
  }
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function adjustRest(r, d) {
  return d === "easy" ? r - 15 : d === "hard" ? r + 15 : r;
}

function goalValue() {
  return document.getElementById("goal").value;
}
function difficultyValue() {
  return document.getElementById("difficulty").value;
}
function roundsValue() {
  return document.getElementById("rounds").value;
}
function equipmentValues() {
  return Array.from(document.getElementById("equipment").selectedOptions).map(o => o.value);
}
