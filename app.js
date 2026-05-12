console.log("app.js loaded and running");

/* =========================
   DATA
========================= */

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

var workoutTimer = null;
var workoutStartTime = null;

/* =========================
   GENERATE WORKOUT
========================= */

function generateWorkout() {
  var goal = document.getElementById("goal").value;
  var equipment = document.getElementById("equipment").value;
  var rounds = Number(document.getElementById("rounds").value);
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";

  var heading = document.createElement("h3");
  heading.textContent = "Workout (" + goal.toUpperCase() + ")";
  output.appendChild(heading);

  var exerciseList = EXERCISES[equipment];

  for (var r = 1; r <= rounds; r++) {
    var roundHeader = document.createElement("h4");
    roundHeader.textContent = "Round " + r;
    output.appendChild(roundHeader);

    for (var i = 0; i < exerciseList.length; i++) {
      var exerciseName = exerciseList[i];

      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = exerciseName;
      card.appendChild(name);

      var prescription = document.createElement("p");
      if (exerciseName === "Plank" || exerciseName === "Farmer Carry") {
        prescription.textContent = "30-45 seconds";
      } else {
        prescription.textContent = GOALS[goal];
      }
      card.appendChild(prescription);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Mark complete";

      btn.addEventListener("click", function () {
        var parent = this.parentNode;
        parent.classList.toggle("completed");

        this.textContent = parent.classList.contains("completed")
          ? "Completed"
          : "Mark complete";
      });

      card.appendChild(btn);
      output.appendChild(card);
    }
  }
}

/* =========================
   START WORKOUT TIMER
========================= */

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

/* =========================
   EVENT WIRING
========================= */

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document
    .getElementById("startWorkoutBtn")
    .addEventListener("click", startWorkout);
});
