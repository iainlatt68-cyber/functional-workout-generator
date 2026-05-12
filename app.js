document.body.insertAdjacentHTML(
  "afterbegin",
  "<div style='background:#ffeb3b;padding:8px;font-weight:bold'>NEW APP.JS LOADED</div>"
);
/* =================================================
   Functional Fitness Generator – Stable + Logged
   Features:
   - Weight & RPE logging
   - Progress counter
   - End-of-workout summary
   - Workout history persistence
================================================= */

console.log("app.js loaded");

/* ---------- DATA ---------- */

var EXERCISES = {
  bodyweight: ["Air Squat", "Push-Ups", "Plank"],
  dumbbells: ["Goblet Squat", "DB Row", "Farmer Carry"],
  gym: ["Back Squat", "Bench Press", "Deadlift"]
};

var GOALS = {
  strength: "3-6 reps",
  hypertrophy: "8-12 reps",
  conditioning: "12-20 reps",
  recovery: "Easy pace"
};

/* ---------- STORAGE HELPERS ---------- */

function loadStore(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- SESSION STATE ---------- */

var workoutTimer = null;
var workoutStartTime = null;
var completedCount = 0;
var totalExercises = 0;

/* ---------- GENERATE WORKOUT ---------- */

function generateWorkout() {
  var goal = document.getElementById("goal").value;
  var equipment = document.getElementById("equipment").value;
  var rounds = Number(document.getElementById("rounds").value);
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";
  completedCount = 0;

  var history = [];

  var heading = document.createElement("h3");
  heading.textContent = "Workout (" + goal.toUpperCase() + ")";
  output.appendChild(heading);

  var progress = document.createElement("p");
  progress.id = "progressCounter";
  output.appendChild(progress);

  var list = EXERCISES[equipment];
  totalExercises = rounds * list.length;

  updateProgress();

  for (var r = 1; r <= rounds; r++) {
    var rh = document.createElement("h4");
    rh.textContent = "Round " + r;
    output.appendChild(rh);

    for (var i = 0; i < list.length; i++) {
      (function (exercise) {
        var card = document.createElement("div");
        card.className = "exercise-card";

        var name = document.createElement("strong");
        name.textContent = exercise;
        card.appendChild(name);

        var pres = document.createElement("p");
        pres.textContent =
          exercise === "Plank" || exercise === "Farmer Carry"
            ? "30-45 seconds"
            : GOALS[goal];
        card.appendChild(pres);

        /* ---- Weight input ---- */
        var weight = document.createElement("input");
        weight.placeholder = "Weight (e.g. 60kg)";
        weight.style.width = "100%";
        weight.style.marginTop = "6px";
        card.appendChild(weight);

        /* ---- RPE select ---- */
        var rpe = document.createElement("select");
        rpe.style.width = "100%";
        rpe.style.marginTop = "6px";

        var rpeDefault = document.createElement("option");
        rpeDefault.value = "";
        rpeDefault.textContent = "RPE (6–10)";
        rpe.appendChild(rpeDefault);

        for (var k = 6; k <= 10; k++) {
          var opt = document.createElement("option");
          opt.value = k;
          opt.textContent = k;
          rpe.appendChild(opt);
        }
        card.appendChild(rpe);

        /* ---- Complete button ---- */
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Mark complete";

        btn.addEventListener("click", function () {
          if (card.classList.contains("completed")) return;

          card.classList.add("completed");
          btn.textContent = "Completed";

          completedCount++;
          updateProgress();

          history.push({
            exercise: exercise,
            weight: weight.value,
            rpe: rpe.value,
            timestamp: new Date().toISOString()
          });

          if (completedCount === totalExercises) {
            finishWorkout(goal, history);
          }
        });

        card.appendChild(btn);
        output.appendChild(card);
      })(list[i]);
    }
  }
}

/* ---------- PROGRESS ---------- */

function updateProgress() {
  var counter = document.getElementById("progressCounter");
  if (counter) {
    counter.textContent =
      "Progress: " + completedCount + " / " + totalExercises;
  }
}

/* ---------- START WORKOUT ---------- */

function startWorkout() {
  if (workoutTimer) clearInterval(workoutTimer);

  var output = document.getElementById("workoutOutput");

  var timer = document.createElement("div");
  timer.id = "workoutTimer";
  timer.style.fontWeight = "600";
  timer.style.margin = "12px 0";
  output.prepend(timer);

  workoutStartTime = Date.now();

  workoutTimer = setInterval(function () {
    var elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
    var mins = Math.floor(elapsed / 60);
    var secs = elapsed % 60;

    timer.textContent =
      "Workout time: " +
      (mins < 10 ? "0" : "") + mins + ":" +
      (secs < 10 ? "0" : "") + secs;
  }, 1000);
}

/* ---------- FINISH & SUMMARY ---------- */

function finishWorkout(goal, history) {
  clearInterval(workoutTimer);

  var elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
  var output = document.getElementById("workoutOutput");

  var pastSessions = loadStore("workoutHistory");
  pastSessions.push({
    date: new Date().toLocaleDateString(),
    goal: goal,
    duration: elapsed,
    exercises: history
  });
  saveStore("workoutHistory", pastSessions);

  output.innerHTML = "";

  var card = document.createElement("div");
  card.className = "exercise-card";

  var title = document.createElement("strong");
  title.textContent = "Workout Complete";
  card.appendChild(title);

  var p1 = document.createElement("p");
  p1.textContent = "Goal: " + goal.toUpperCase();
  card.appendChild(p1);

  var p2 = document.createElement("p");
  p2.textContent = "Exercises completed: " + completedCount;
  card.appendChild(p2);

  var p3 = document.createElement("p");
  p3.textContent =
    "Total time: " +
    Math.floor(elapsed / 60) + ":" +
    ("0" + (elapsed % 60)).slice(-2);
  card.appendChild(p3);

  var p4 = document.createElement("p");
  p4.textContent = "History saved. Nice work.";
  card.appendChild(p4);

  output.appendChild(card);
}

/* ---------- EVENTS ---------- */

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document
    .getElementById("startWorkoutBtn")
    .addEventListener("click", startWorkout);
});
