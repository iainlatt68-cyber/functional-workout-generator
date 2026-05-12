console.log("✅ script.js loaded and executing");

/* ===============================
   EXERCISE METADATA
================================ */

var EXERCISE_LIBRARY = [
  // Squat
  { name: "Air Squat", pattern: "squat", level: "beginner", timeBased: false },
  { name: "Goblet Squat", pattern: "squat", level: "intermediate", timeBased: false },
  { name: "Back Squat", pattern: "squat", level: "advanced", timeBased: false },

  // Hinge
  { name: "Glute Bridge", pattern: "hinge", level: "beginner", timeBased: false },
  { name: "Deadlift", pattern: "hinge", level: "advanced", timeBased: false },

  // Push
  { name: "Push‑Ups", pattern: "push", level: "beginner", timeBased: false },
  { name: "Bench Press", pattern: "push", level: "advanced", timeBased: false },

  // Pull
  { name: "Dumbbell Row", pattern: "pull", level: "intermediate", timeBased: false },
  { name: "Pull‑Ups", pattern: "pull", level: "advanced", timeBased: false },

  // Core (time‑based)
  { name: "Plank", pattern: "core", level: "beginner", timeBased: true }
];

/* ===============================
   GOAL‑BASED TRAINING RULES
================================ */

var GOALS = {
  strength: {
    reps: "3–6 reps",
    time: "20–30 seconds",
    rounds: 3
  },
  hypertrophy: {
    reps: "8–15 reps",
    time: "30–45 seconds",
    rounds: 3
  },
  conditioning: {
    reps: "12–20 reps",
    time: "40–60 seconds",
    rounds: 4
  },
  recovery: {
    reps: "8–10 easy reps",
    time: "20–30 seconds",
    rounds: 2
  }
};

/* ===============================
   HELPERS
================================ */

function pickExercises(level) {
  var patterns = ["squat", "hinge", "push", "pull", "core"];
  var chosen = [];

  for (var i = 0; i < patterns.length; i++) {
    var options = [];

    for (var j = 0; j < EXERCISE_LIBRARY.length; j++) {
      var ex = EXERCISE_LIBRARY[j];
      if (
        ex.pattern === patterns[i] &&
        (ex.level === level || level === "advanced")
      ) {
        options.push(ex);
      }
    }

    if (options.length > 0) {
      chosen.push(options[Math.floor(Math.random() * options.length)]);
    }
  }

  return chosen;
}

/* ===============================
   WORKOUT GENERATOR
================================ */

function generateWorkout() {
  console.log("✅ generateWorkout running");

  var levelEl = document.getElementById("level");
  var sessionEl = document.getElementById("session");
  var output = document.getElementById("workoutOutput");

  if (!levelEl || !output) {
    console.error("❌ Required DOM elements missing");
    return;
  }

  var level = levelEl.value;
  var goal = sessionEl ? sessionEl.value : "strength";

  if (!GOALS[goal]) {
    goal = "strength";
  }

  var rounds = GOALS[goal].rounds;

  output.innerHTML = "";

  /* Intent label */
  var intent = document.createElement("p");
  intent.style.fontWeight = "600";
  intent.style.marginBottom = "12px";
  intent.textContent = "Training goal: " + goal.toUpperCase();
  output.appendChild(intent);

  var workout = pickExercises(level);

  for (var r = 1; r <= rounds; r++) {
    var roundHeader = document.createElement("h3");
    roundHeader.textContent = "Round " + r;
    output.appendChild(roundHeader);

    for (var i = 0; i < workout.length; i++) {
      var exercise = workout[i];

      if (!exercise) continue;

      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = exercise.name;
      card.appendChild(name);

      var p = document.createElement("p");
      p.textContent = exercise.timeBased
        ? GOALS[goal].time
        : GOALS[goal].reps;
      card.appendChild(p);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Mark complete ✅";
      btn.onclick = function () {
        this.parentNode.classList.toggle("completed");
      };

      card.appendChild(btn);
      output.appendChild(card);
    }
  }
}

/* ===============================
   EVENT WIRING
================================ */

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM ready");

  var btn = document.getElementById("generateWorkoutBtn");

  if (!btn) {
    console.error("❌ generateWorkoutBtn not found");
    return;
  }

  btn.addEventListener("click", function () {
    console.log("✅ Generate Workout clicked");
    generateWorkout();
  });
});
