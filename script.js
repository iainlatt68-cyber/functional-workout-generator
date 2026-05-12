console.log("✅ script.js loaded");

/* ===== EXERCISES ===== */
var EXERCISES = {
  bodyweight: {
    beginner: ["Squats", "Wall Push-Ups", "Glute Bridges"],
    intermediate: ["Push-Ups", "Lunges", "Plank"],
    advanced: ["Pistol Squats", "Burpees"]
  },
  dumbbells: {
    beginner: ["Goblet Squat", "DB Row"],
    intermediate: ["Split Squat", "DB Press"],
    advanced: ["Man Makers", "Devil Press"]
  },
  gym: {
    beginner: ["Leg Press", "Lat Pulldown", "Bike"],
    intermediate: ["Back Squat", "Bench Press", "Row"],
    advanced: ["Deadlift", "Pull-Ups", "Push Press"]
  }
};

/* ===== HELPERS ===== */
function shuffle(arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
}

function repsFor(level) {
  if (level === "beginner") return "8–10 reps";
  if (level === "intermediate") return "10–12 reps";
  return "12–15 reps";
}

/* ===== WORKOUT ===== */
function generateWorkout() {
  var level = document.getElementById("level").value;
  var duration = document.getElementById("duration").value;
  var equipment = document.getElementById("equipment").value;
  var roundsEl = document.getElementById("rounds");
  var rounds = roundsEl ? Number(roundsEl.value) : 1;
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";

  var pool = EXERCISES[equipment][level];
  var count = duration === "10" ? 3 : duration === "20" ? 4 : 5;
  var exercises = shuffle(pool.slice(0, count));
  var reps = repsFor(level);

  for (var r = 1; r <= rounds; r++) {
    var h = document.createElement("h3");
    h.textContent = rounds > 1 ? "Circuit – Round " + r : "Workout";
    output.appendChild(h);

    for (var i = 0; i < exercises.length; i++) {
      var card = document.createElement("div");
      card.className = "exercise-card";

      var btn = document.createElement("button");
      btn.textContent = "Mark complete ✅";
      btn.onclick = function () {
        this.parentNode.classList.toggle("completed");
        this.textContent =
          this.parentNode.classList.contains("completed")
            ? "Completed ✅"
            : "Mark complete ✅";
      };

      card.innerHTML =
        "<strong>" + exercises[i] + "</strong><p>" + reps + "</p>";

      card.appendChild(btn);
      output.appendChild(card);
    }
  }
}

/* ===== TIMER ===== */
var timerId;
var timeLeft = 30;

function startTimer() {
  clearInterval(timerId);
  var duration = document.getElementById("duration").value;
  var timer = document.getElementById("timer");

  timeLeft = duration === "10" ? 30 : duration === "20" ? 45 : 60;
  timer.textContent = timeLeft + " seconds";

  timerId = setInterval(function () {
    timeLeft--;
    timer.textContent = timeLeft + " seconds";

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timer.textContent = "Rest complete ✅";
    }
  }, 1000);
}

/* ===== EVENTS ===== */
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document
    .getElementById("startTimerBtn")
    .addEventListener("click", startTimer);
});
