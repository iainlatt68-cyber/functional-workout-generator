console.log("app.js loaded");

/* ===== DATA ===== */

var EXERCISES = {
  bodyweight: ["Air Squat", "Push-Ups", "Glute Bridge", "Plank"],
  dumbbells: ["Goblet Squat", "DB Row", "DB Press", "Farmer Carry"],
  gym: ["Back Squat", "Bench Press", "Deadlift", "Pull-Ups"]
};

var GOALS = {
  strength: "3-6 reps",
  hypertrophy: "8-12 reps",
  conditioning: "12-20 reps",
  recovery: "Easy pace"
};

var workoutStartTime = null;
var workoutTimer = null;

/* ===== GENERATE WORKOUT ===== */

function generateWorkout() {
  var goal = document.getElementById("goal").value;
  var equipment = document.getElementById("equipment").value;
  var rounds = Number(document.getElementById("rounds").value);
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";

  var intent = document.createElement("p");
  intent.textContent = "Goal: " + goal.toUpperCase();
  intent.style.marginBottom = "12px";
  output.appendChild(intent);

  var list = EXERCISES[equipment];
  var totalExercises = rounds * list.length;
  var completed = 0;

  for (var r = 1; r <= rounds; r++) {
    var header = document.createElement("h3");
    header.textContent = "Round " + r;
    output.appendChild(header);

    for (var i = 0; i < list.length; i++) {
      var exercise = list[i];

      var card = document.createElement("div");
      card.className = "exercise-card";

      var title = document.createElement("strong");
      title.textContent = exercise;
      card.appendChild(title);

      var p = document.createElement("p");
      if (exercise === "Plank" || exercise === "Farmer Carry") {
        p.textContent = "30-45 seconds";
      } else {
        p.textContent = GOALS[goal];
      }
      card.appendChild(p);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Mark complete";
      btn.onclick = function () {
        if (!card.classList.contains("completed")) {
          card.classList.add("completed");
          completed++;

          if (completed === totalExercises) {
            finishWorkout(goal, completed, totalExercises);
          }
        }
      };

      card.appendChild(btn);
      output.appendChild(card);
    }
  }
}

/* ===== START WORKOUT ===== */

function startWorkout() {
  if (workoutTimer) {
    clearInterval(workoutTimer);
  }

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

/* ===== END WORKOUT ===== */

function finishWorkout(goal, done, total) {
  clearInterval(workoutTimer);

  var elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
  var output = document.getElementById("workoutOutput");
  output.innerHTML = "";

  var card = document.createElement("div");
  card.className = "exercise-card";

  var summary =
    "Workout complete\n" +
    "Goal: " + goal.toUpperCase() + "\n" +
    "Completed: " + done + " of " + total + "\n" +
    "Time: " +
    Math.floor(elapsed / 60) + ":" +
    ("0" + (elapsed % 60)).slice(-2);

  var pre = document.createElement("pre");
  pre.textContent = summary;
  card.appendChild(pre);

  output.appendChild(card);
}

/* ===== EVENTS ===== */

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("generateWorkoutBtn").onclick = generateWorkout;
  document.getElementById("startWorkoutBtn").onclick = startWorkout;
});
