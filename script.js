console.log("✅ script.js loaded and executing");

/* ===============================
   BASIC EXERCISE DATA (SAFE)
================================ */

/* ===============================
   EXERCISE METADATA (SAFE)
================================ */

var EXERCISE_LIBRARY = [
  // Squat pattern
  { name: "Air Squat", pattern: "squat", level: "beginner", timeBased: false },
  { name: "Goblet Squat", pattern: "squat", level: "intermediate", timeBased: false },
  { name: "Back Squat", pattern: "squat", level: "advanced", timeBased: false },

  // Push pattern
  { name: "Push-Ups", pattern: "push", level: "beginner", timeBased: false },
  { name: "Bench Press", pattern: "push", level: "advanced", timeBased: false },

  // Hinge
  { name: "Glute Bridge", pattern: "hinge", level: "beginner", timeBased: false },
  { name: "Deadlift", pattern: "hinge", level: "advanced", timeBased: false },

  // Pull
  { name: "Dumbbell Row", pattern: "pull", level: "intermediate", timeBased: false },
  { name: "Pull-Ups", pattern: "pull", level: "advanced", timeBased: false },

  // Core (time‑based)
  { name: "Plank", pattern: "core", level: "beginner", timeBased: true }
];
function pickExercises(level) {
  var patterns = ["squat", "hinge", "push", "pull", "core"];
  var chosen = [];

  for (var i = 0; i < patterns.length; i++) {
    var options = EXERCISE_LIBRARY.filter(function (ex) {
      return ex.pattern === patterns[i] &&
             (ex.level === level || level === "advanced");
    });

    if (options.length > 0) {
      chosen.push(options[Math.floor(Math.random() * options.length)]);
    }
  }

  return chosen;
}
/* ===============================
   GOAL-BASED TRAINING RULES
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
``
/* ===============================
   WORKOUT GENERATOR (SAFE)
================================ */
var goal = document.getElementById("session").value;
function generateWorkout() {
  console.log("✅ generateWorkout() running");

  var level = document.getElementById("level").value;
  var rounds = GOALS[goal].rounds;
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";

  // Section heading
  var h = document.createElement("h3");
  h.textContent = "Workout";
  output.appendChild(h);

  for (var r = 1; r <= rounds; r++) {
    var rh = document.createElement("h4");
    rh.textContent = "Round " + r;
    output.appendChild(rh);

  var workout = pickExercises(level);

for (var i = 0; i < workout.length; i++) {
  var exercise = workout[i];
  p.textContent = exercise.timeBased
  ? GOALS[goal].time
  : GOALS[goal].reps;

      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = EXERCISES[level][i];
      card.appendChild(name);

      var p = document.createElement("p");
      p.textContent =
        EXERCISES[level][i] === "Plank"
          ? "30–45 seconds"
          : "8–12 reps";
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
   EVENT WIRING (SAFE)
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
