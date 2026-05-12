console.log("✅ script.js loaded");

/* ===============================
   SIMPLE DATA
================================ */

var EXERCISES = {
  beginner: ["Air Squat", "Push-Ups", "Glute Bridge", "Plank"],
  intermediate: ["Goblet Squat", "Dumbbell Row", "Lunges", "Plank"],
  advanced: ["Back Squat", "Bench Press", "Deadlift", "Pull-Ups"]
};

/* ===============================
   GENERATE WORKOUT
================================ */

function generateWorkout() {
  console.log("✅ generateWorkout running");

  var levelEl = document.getElementById("level");
  var roundsEl = document.getElementById("rounds");
  var output = document.getElementById("workoutOutput");

  if (!levelEl || !output) {
    console.error("❌ Missing elements");
    return;
  }

  var level = levelEl.value;
  var rounds = roundsEl ? Number(roundsEl.value) : 1;

  output.innerHTML = "";

  var title = document.createElement("h3");
  title.textContent = "Your Workout";
  output.appendChild(title);

  for (var r = 1; r <= rounds; r++) {
    var rh = document.createElement("h4");
    rh.textContent = "Round " + r;
    output.appendChild(rh);

    for (var i = 0; i < EXERCISES[level].length; i++) {
      var nameText = EXERCISES[level][i];

      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = nameText;
      card.appendChild(name);

      var p = document.createElement("p");
      p.textContent = nameText === "Plank" ? "30–45 seconds" : "8–12 reps";
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
   START WORKOUT
================================ */

var workoutTimer = null;

function startWorkout() {
  console.log("✅ startWorkout running");

  var output = document.getElementById("workoutOutput");
  if (!output) return;

  if (workoutTimer) clearInterval(workoutTimer);

  var timer = document.getElementById("workoutTimer");
  if (!timer) {
    timer = document.createElement("div");
    timer.id = "workoutTimer";
    timer.style.margin = "12px 0";
    timer.style.fontWeight = "600";
    timer.textContent = "Workout in progress: 00:00";
    output.prepend(timer);
  }

  var start = Date.now();

  workoutTimer = setInterval(function () {
    var seconds = Math.floor((Date.now() - start) / 1000);
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    timer.textContent =
      "Workout in progress: " +
      (mins < 10 ? "0" : "") + mins + ":" +
      (secs < 10 ? "0" : "") + secs;
  }, 1000);
}

/* ===============================
   EVENTS
================================ */

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM ready");

  var genBtn = document.getElementById("generateWorkoutBtn");
  var startBtn = document.getElementById("startWorkoutBtn");

  if (genBtn) {
    genBtn.addEventListener("click", generateWorkout);
  } else {
    console.error("❌ generateWorkoutBtn missing");
  }

  if (startBtn) {
    startBtn.addEventListener("click", startWorkout);
  } else {
    console.error("❌ startWorkoutBtn missing");
  }
});
