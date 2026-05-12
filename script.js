console.log("✅ script.js loaded and executing");

/* ===============================
   BASIC EXERCISE DATA (SAFE)
================================ */

var EXERCISES = {
  beginner: [
    "Squats",
    "Push‑Ups",
    "Glute Bridges",
    "Plank"
  ],
  intermediate: [
    "Goblet Squat",
    "Dumbbell Row",
    "Lunges",
    "Plank"
  ],
  advanced: [
    "Back Squat",
    "Bench Press",
    "Deadlift",
    "Pull‑Ups"
  ]
};

/* ===============================
   WORKOUT GENERATOR (SAFE)
================================ */

function generateWorkout() {
  console.log("✅ generateWorkout() running");

  var level = document.getElementById("level").value;
  var rounds = Number(document.getElementById("rounds").value || 1);
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

    for (var i = 0; i < EXERCISES[level].length; i++) {
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
