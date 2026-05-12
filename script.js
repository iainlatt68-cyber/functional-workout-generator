console.log("✅ Smart workout engine loaded");

/* ===============================
   EXERCISE KNOWLEDGE BASE
================================ */

const EXERCISE_LIBRARY = [
  // --- Lower body ---
  { name: "Back Squat", pattern: "squat", equipment: "gym", skill: "intermediate", fatigue: 3, jointStress: "high", energy: "mechanical" },
  { name: "Goblet Squat", pattern: "squat", equipment: "dumbbells", skill: "beginner", fatigue: 2, jointStress: "low", energy: "mechanical" },

  { name: "Deadlift", pattern: "hinge", equipment: "gym", skill: "intermediate", fatigue: 3, jointStress: "high", energy: "mechanical" },
  { name: "Glute Bridge", pattern: "hinge", equipment: "bodyweight", skill: "beginner", fatigue: 1, jointStress: "low", energy: "mechanical" },

  // --- Upper body ---
  { name: "Bench Press", pattern: "push", equipment: "gym", skill: "intermediate", fatigue: 3, jointStress: "moderate", energy: "mechanical" },
  { name: "Push‑Ups", pattern: "push", equipment: "bodyweight", skill: "beginner", fatigue: 1, jointStress: "low", energy: "mechanical" },

  { name: "Pull‑Ups", pattern: "pull", equipment: "gym", skill: "advanced", fatigue: 3, jointStress: "moderate", energy: "mechanical" },
  { name: "Dumbbell Row", pattern: "pull", equipment: "dumbbells", skill: "beginner", fatigue: 2, jointStress: "low", energy: "mechanical" },

  // --- Core / conditioning ---
  { name: "Plank", pattern: "core", equipment: "bodyweight", skill: "beginner", fatigue: 1, jointStress: "low", energy: "isometric", timeBased: true },
  { name: "Farmer Carry", pattern: "core", equipment: "dumbbells", skill: "intermediate", fatigue: 2, jointStress: "moderate", energy: "isometric", timeBased: true }
];

/* ===============================
   TRAINING RULES
================================ */

const GOALS = {
  strength:    { reps: "3–6 reps", rest: "2–3 min", fatigueBias: "mechanical" },
  hypertrophy:{ reps: "8–15 reps", rest: "60–90 sec", fatigueBias: "mixed" },
  conditioning:{ reps: null, rest: "30–45 sec", fatigueBias: "metabolic" },
  recovery:   { reps: null, rest: "Easy pace", fatigueBias: "low" }
};

function timePrescription(level) {
  if (level === "beginner") return "20–30 sec";
  if (level === "intermediate") return "30–45 sec";
  return "45–60 sec";
}

/* ===============================
   HELPERS
================================ */

function shuffle(arr) {
  return arr
    .map(v => ({ v, s: Math.random() }))
    .sort((a,b) => a.s - b.s)
    .map(o => o.v);
}

function loadHistory() {
  return JSON.parse(localStorage.getItem("trainingHistory") || "[]");
}

function saveSession(session) {
  const history = loadHistory();
  history.push(session);
  localStorage.setItem("trainingHistory", JSON.stringify(history));
}

function allowedForLevel(ex, level) {
  if (ex.skill === "advanced" && level === "beginner") return false;
  return true;
}

/* ===============================
   SMART SELECTION ENGINE
================================ */

function selectExercises({ equipment, level, goal }) {
  return shuffle(
    EXERCISE_LIBRARY.filter(e =>
      e.equipment === equipment &&
      allowedForLevel(e, level)
    )
  )
  .sort((a,b) => a.fatigue - b.fatigue)
  .slice(0, 5);
}

/* ===============================
   UI PROGRESS
================================ */

function updateProgress(output) {
  const cards = output.querySelectorAll(".exercise-card");
  const done = output.querySelectorAll(".exercise-card.completed").length;
  const bar = output.querySelector(".progress-bar");

  if (bar && cards.length) {
    bar.style.width = Math.round((done / cards.length) * 100) + "%";
  }
}

/* ===============================
   MAIN GENERATOR
================================ */

function generateWorkout() {
  const level = document.getElementById("level").value;
  const goal  = document.getElementById("session").value;
  const equipment = document.getElementById("equipment").value;
  const rounds = Number(document.getElementById("rounds").value || 1);
  const output = document.getElementById("workoutOutput");

  output.innerHTML = "";

  // Progress bar
  const wrap = document.createElement("div");
  wrap.className = "progress-wrapper";
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  wrap.appendChild(bar);
  output.appendChild(wrap);

  const exercises = selectExercises({ equipment, level, goal });

  for (let r = 1; r <= rounds; r++) {
    const title = document.createElement("h3");
    title.textContent = `Round ${r}`;
    title.className = "section-heading";
    output.appendChild(title);

    exercises.forEach(ex => {
      let prescription;
      if (ex.timeBased || GOALS[goal].reps === null) {
        prescription = timePrescription(level);
      } else {
        prescription = GOALS[goal].reps;
      }

      // Fatigue scaling
      if (r > 1) prescription += " (reduce effort)";

      const card = document.createElement("div");
      card.className = "exercise-card";

      const name = document.createElement("strong");
      name.textContent = ex.name;
      card.appendChild(name);

      const p = document.createElement("p");
      p.textContent = prescription;
      card.appendChild(p);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Mark complete ✅";
      btn.onclick = () => {
        card.classList.toggle("completed");
        updateProgress(output);
      };
      card.appendChild(btn);

      output.appendChild(card);
    });
  }

  // Explainability
  const explain = document.createElement("div");
  explain.className = "exercise-card";
  explain.innerHTML = `
    <strong>Why this workout?</strong>
    <p>This session emphasises <b>${goal}</b> principles with ${GOALS[goal].rest} rests,
    respecting your experience level and minimising unnecessary fatigue.</p>
  `;
  output.appendChild(explain);

  saveSession({ date: new Date().toISOString(), level, goal, equipment });

  updateProgress(output);
}

/* ===============================
   EVENT WIRING
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generateWorkoutBtn");
  if (btn) btn.addEventListener("click", generateWorkout);
});
