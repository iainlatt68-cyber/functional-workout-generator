console.log("app.js loaded");

var workoutTimer = null;
var workoutStartTime = null;

var EXERCISES = {
  bodyweight: ["Air Squat", "Push-Ups", "Plank"],
  dumbbells: ["Goblet Squat", "DB Row", "Farmer Carry"],
  gym: ["Back Squat", "Bench Press", "Deadlift"]
};

var GOALS = {
  strength: "3–6 reps",
  hypertrophy: "8–12 reps",
  conditioning: "12–20 reps",
  recovery: "Easy pace"
};

function generateWorkout() {
  var goal = document.getElementById("goal").value;
  var equipment = document.getElementById("equipment").value;
  var rounds = Number(document.getElementById("rounds").value);
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";

  var heading = document.createElement("h3");
  heading.textContent = "Workout (" + goal.toUpperCase() + ")";
  output.appendChild(heading);

  var list = EXERCISES[equipment];

  for (var r = 1; r <= rounds; r++) {
    var rh = document.createElement("h4");
    rh.textContent = "Round " + r;
    output.appendChild(rh);

    for (var i = 0; i < list.length; i++) {
      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = list[i];
      card.appendChild(name);

      var p = document.createElement("p");
      p.textContent =
        list[i] === "Plank" || list[i] === "Farmer Carry"
          ? "30–45 seconds"
          : GOALS[goal];
      card.appendChild(p);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Mark complete";
      btn.onclick = function () {
        card.classList.toggle("completed");
      };

      card.appendChild(btn);
      output.appendChild(card);
    }
  }
}

function startWorkout() {
  if (workoutTimer) clearInterval(workoutTimer);

  var output = document.getElementById("workoutOutput");

  var timer = document.createElement("div");
  timer.id = "workoutTimer";
  output.prepend(timer);

  workoutStartTime = Date.now();

  workoutTimer = setInterval(function () {
    var seconds = Math.floor((Date.now() - workoutStartTime) / 1000);
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;

    timer.textContent =
      "Workout time: " +
      (mins < 10 ? "0" : "") + mins + ":" +
      (secs < 10 ? "0" : "") + secs;
  }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("generateWorkoutBtn").onclick = generateWorkout;
  document.getElementById("startWorkoutBtn").onclick = startWorkout;
});
