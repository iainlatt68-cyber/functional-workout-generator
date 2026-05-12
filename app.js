console.log("✅ app.js loaded");

/* ===============================
   DATA
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
  console.log("✅ generateWorkout()");

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

  var heading = document.createElement("h3");
  heading.textContent = "Your Workout";
  output.appendChild(heading);

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
      p.textContent =
        nameText === "Plank" ? "30–45 seconds" : "8–12 reps";
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
   START WORKOUT TIMER
================================ */

var workoutInterval = null;

function startWorkout() {
  console.log("✅ startWorkout()");

  var output = document.getElementById("workoutOutput");
  if (!output) return;

  if (workoutInterval) clearInterval(workoutInterval);

  var timer = document.getElementById("workoutTimer");
  if (!timer) {
    timer = document.createElement("div");
    timer.id = "workoutTimer";
    timer.style.fontWeight = "600";
    timer.style.margin = "16px 0";
    output.prepend(timer);
  }

  var startTime = Date.now();

  workoutInterval = setInterval(function () {
    var elapsed = Math.floor((Date.now() - startTime) / 1000);
    var mins = Math.floor(elapsed / 60);
    var secs = elapsed % 60;

    timer.textContent =
      "Workout in progress: " +
      (mins < 10 ? "0" : "") + mins + ":" +
      (secs < 10 ? "0" : "") + secs;
  }, 1000);
}

/* ===============================
   EVENT WIRING
================================ */

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM ready");

  var generateBtn = document.getElementById("generateWorkoutBtn");
  var startBtn = document.getElementById("startWorkoutBtn");

  if (generateBtn) {
    generateBtn.addEventListener("click", generateWorkout);
  } else {
    console.error("❌ generateWorkoutBtn not found");
  }

  if (startBtn) {
    startBtn.addEventListener("click", startWorkout);
  } else {
    console.error("❌ startWorkoutBtn not found");
  }
});
