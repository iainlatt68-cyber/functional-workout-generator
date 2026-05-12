console.log("✅ script.js loaded");

/* ===============================
   BASIC DATA
================================ */

var EXERCISES = {
  beginner: ["Air Squat", "Push-Ups", "Glute Bridge", "Plank"],
  intermediate: ["Goblet Squat", "Dumbbell Row", "Lunges", "Plank"],
  advanced: ["Back Squat", "Bench Press", "Deadlift", "Pull-Ups"]
};

/* ===============================
   WORKOUT GENERATION
================================ */

function generateWorkout() {
  console.log("✅ generateWorkout running");

  var levelSelect = document.getElementById("level");
  var roundsSelect = document.getElementById("rounds");
  var output = document.getElementById("workoutOutput");

  if (!levelSelect || !output) {
    console.error("❌ Required elements missing");
    return;
  }

  var level = levelSelect.value;
  var rounds = roundsSelect ? Number(roundsSelect.value) : 1;

  output.innerHTML = "";

  var title = document.createElement("h3");
  title.textContent = "Your Workout";
  output.appendChild(title);

  for (var r = 1; r <= rounds; r++) {
    var roundHeader = document.createElement("h4");
    roundHeader.textContent = "Round " + r;
    output.appendChild(roundHeader);

    for (var i = 0; i < EXERCISES[level].length; i++) {
      var exerciseName = EXERCISES[level][i];

      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = exerciseName;
      card.appendChild(name);

      var prescription = document.createElement("p");
      prescription.textContent =
        exerciseName === "Plank"
          ? "30–45 seconds"
          : "8–12 reps";
      card.appendChild(prescription);

      var completeBtn = document.createElement("button");
      completeBtn.type = "button";
      completeBtn.textContent = "Mark complete ✅";
      completeBtn.onclick = function () {
        this.parentNode.classList.toggle("completed");
      };

      card.appendChild(completeBtn);
      output.appendChild(card);
    }
  }

  console.log("✅ Workout generated");
}

/* ===============================
   WORKOUT TIMER
================================ */

var workoutInterval = null;

function startWorkout() {
  console.log("✅ startWorkout running");

  var output = document.getElementById("workoutOutput");
  if (!output) return;

  // Prevent multiple timers
  if (workoutInterval) {
    clearInterval(workoutInterval);
  }

  // Create / reset timer display
  var timer = document.getElementById("workoutTimer");
  if (!timer) {
    timer = document.createElement("div");
    timer.id = "workoutTimer";
    timer.style.fontWeight = "600";
    timer.style.margin = "16px 0";
    timer.style.color = "#16a34a";
    output.prepend(timer);
  }

  var startTime = Date.now();

  workoutInterval = setInterval(function () {
    var seconds = Math.floor((Date.now() - startTime) / 1000);
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;

    timer.textContent =
      "Workout in progress: " +
      (mins < 10 ? "0" : "") + mins + ":" +
      (secs < 10 ? "0" : "") + secs;
  }, 1000);

  // Lock the setup panel
  var setup = document.querySelector(".setup-card");
  if (setup) {
    setup.style.opacity = "0.6";
    setup.style.pointerEvents = "none";
  }

  console.log("✅ Workout timer started");
}

/* ===============================
   EVENT WIRING
================================ */

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM ready");

  var generateBtn = document.getElementById("generateWorkoutBtn");
  var startBtn = document.getElementById("startWorkoutBtn");

  if (generateBtn) {
    generateBtn.addEventListener("click", function () {
      generateWorkout();
    });
  } else {
    console.error("❌ generateWorkoutBtn not found");
  }

  if (startBtn) {
    startBtn.addEventListener("click", function () {
      startWorkout();
    });
  } else {
    console.error("❌ startWorkoutBtn not found");
  }
});
