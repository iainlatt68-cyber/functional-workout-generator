console.log("✅ app.js loaded");

/* ===============================
   EXERCISE DATA BY EQUIPMENT
================================ */

var EXERCISES = {
  bodyweight: {
    beginner: ["Air Squat", "Push-Ups", "Glute Bridge", "Plank"],
    intermediate: ["Split Squat", "Incline Push-Ups", "Single-Leg Bridge", "Plank"],
    advanced: ["Pistol Squat", "Decline Push-Ups", "Nordic Hold", "Plank"]
  },
  dumbbells: {
    beginner: ["Goblet Squat", "DB Row", "DB Floor Press", "Farmer Carry"],
    intermediate: ["Split Squat", "DB Bench Press", "DB RDL", "Farmer Carry"],
    advanced: ["Bulgarian Split Squat", "DB Push Press", "DB RDL", "Farmer Carry"]
  },
  gym: {
    beginner: ["Leg Press", "Lat Pulldown", "Chest Press", "Plank"],
    intermediate: ["Back Squat", "Bench Press", "RDL", "Hanging Knee Raise"],
    advanced: ["Front Squat", "Weighted Pull-Ups", "Deadlift", "Toes-to-Bar"]
  }
};

/* ===============================
   GOAL LOGIC
================================ */

var GOALS = {
  strength: { reps: "3–6 reps", time: "20–30 sec" },
  hypertrophy: { reps: "8–15 reps", time: "30–45 sec" },
  conditioning: { reps: "12–20 reps", time: "40–60 sec" },
  recovery: { reps: "8–10 easy reps", time: "20–30 sec" }
};

/* ===============================
   GENERATE WORKOUT
================================ */

function generateWorkout() {
  console.log("✅ generateWorkout running");

  var level = document.getElementById("level").value;
  var goal = document.getElementById("goal").value;
  var equipment = document.getElementById("equipment").value;
  var rounds = Number(document.getElementById("rounds").value);
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";

  // Intent label
  var intent = document.createElement("p");
  intent.className = "workout-intent";
  intent.textContent = "Goal: " + goal.toUpperCase() + " | Equipment: " + equipment;
  output.appendChild(intent);

  var list = EXERCISES[equipment][level];

  for (var r = 1; r <= rounds; r++) {
    var rh = document.createElement("h3");
    rh.textContent = "Round " + r;
    output.appendChild(rh);

    for (var i = 0; i < list.length; i++) {
      var exercise = list[i];

      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = exercise;
      card.appendChild(name);

      var p = document.createElement("p");
      p.textContent =
        exercise.toLowerCase().includes("plank") ||
        exercise.toLowerCase().includes("carry")
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
   START WORKOUT (TIMER)
================================ */

var workoutTimer;

function startWorkout() {
  console.log("✅ startWorkout running");

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

/* ===============================
   EVENTS
================================ */

document.addEventListener("DOMContentLoaded", function () {
  var generateBtn = document.getElementById("generateWorkoutBtn");
  var startBtn = document.getElementById("startWorkoutBtn");

  generateBtn.addEventListener("click", generateWorkout);
  startBtn.addEventListener("click", startWorkout);
});
