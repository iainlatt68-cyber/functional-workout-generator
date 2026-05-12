console.log("✅ app.js loaded");

/* ========== DATA ========== */

var EXERCISES = {
  beginner: ["Air Squat", "Push-Ups", "Glute Bridge", "Plank"],
  intermediate: ["Goblet Squat", "Dumbbell Row", "Lunges", "Plank"],
  advanced: ["Back Squat", "Bench Press", "Deadlift", "Pull-Ups"]
};

/* ========== GENERATE WORKOUT ========== */

function generateWorkout() {
  console.log("✅ generateWorkout called");

  var level = document.getElementById("level").value;
  var rounds = Number(document.getElementById("rounds").value);
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";

  for (var r = 1; r <= rounds; r++) {
    var roundTitle = document.createElement("h3");
    roundTitle.textContent = "Round " + r;
    output.appendChild(roundTitle);

    EXERCISES[level].forEach(function (exercise) {
      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = exercise;
      card.appendChild(name);

      var p = document.createElement("p");
      p.textContent =
        exercise === "Plank" ? "30–45 seconds" : "8–12 reps";
      card.appendChild(p);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Mark complete ✅";
      btn.onclick = function () {
        card.classList.toggle("completed");
      };

      card.appendChild(btn);
      output.appendChild(card);
    });
  }
}

/* ========== START WORKOUT ========== */

var workoutTimer;

function startWorkout() {
  console.log("✅ startWorkout called");

  var output = document.getElementById("workoutOutput");
  if (!output) return;

  if (workoutTimer) clearInterval(workoutTimer);

  var timer = document.getElementById("workoutTimer");
  if (!timer) {
    timer = document.createElement("div");
    timer.id = "workoutTimer";
    timer.style.margin = "16px 0";
    timer.style.fontWeight = "600";
    output.prepend(timer);
  }

  var start = Date.now();

  workoutTimer = setInterval(function () {
    var secs = Math.floor((Date.now() - start) / 1000);
    var min = Math.floor(secs / 60);
    var sec = secs % 60;

    timer.textContent =
      "Workout in progress: " +
      (min < 10 ? "0" : "") + min + ":" +
      (sec < 10 ? "0" : "") + sec;
  }, 1000);
}

/* ========== EVENTS ========== */

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM ready");

  document
    .getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document
    .getElementById("startWorkoutBtn")
    .addEventListener("click", startWorkout);
});
