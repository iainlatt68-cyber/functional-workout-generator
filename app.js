/* =================================================
   Functional Fitness Generator
   Fast / Athletic Interaction Model
================================================= */

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
var exerciseIndex = 0;

/* ---------- Generate Workout ---------- */

function generateWorkout() {
  var goal = document.getElementById("goal").value;
  var equipment = document.getElementById("equipment").value;
  var rounds = Number(document.getElementById("rounds").value);
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";
  exerciseIndex = 0;

  var title = document.createElement("h3");
  title.textContent = "Workout (" + goal.toUpperCase() + ")";
  output.appendChild(title);

  var list = EXERCISES[equipment];

  for (var r = 1; r <= rounds; r++) {
    var roundHeader = document.createElement("h4");
    roundHeader.textContent = "Round " + r;
    output.appendChild(roundHeader);

    list.forEach(function (exercise) {
      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = exercise;
      card.appendChild(name);

      var p = document.createElement("p");
      p.textContent =
        exercise === "Plank" || exercise === "Farmer Carry"
          ? "30-45 seconds"
          : GOALS[goal];
      card.appendChild(p);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Complete";

      btn.addEventListener("click", function () {
        if (card.classList.contains("completed")) return;

        card.classList.remove("active");
        card.classList.add("completed");

        exerciseIndex++;
        showRest();
      });

      card.appendChild(btn);
      output.appendChild(card);
    });
  }

  setActiveExercise();
}

/* ---------- Active Exercise ---------- */

function setActiveExercise() {
  var cards = document.querySelectorAll(".exercise-card");
  cards.forEach(function (card, i) {
    card.classList.toggle("active", i === exerciseIndex);
  });

  if (exerciseIndex >= cards.length) {
    showSessionComplete();
  }
}

/* ---------- Rest Countdown ---------- */

function showRest() {
  var overlay = document.createElement("div");
  overlay.id = "restOverlay";
  document.body.appendChild(overlay);

  var time = 30;
  overlay.textContent = time;

  var interval = setInterval(function () {
    time--;
    overlay.textContent = time;

    if (time <= 0) {
      clearInterval(interval);
      overlay.remove();
      setActiveExercise();
    }
  }, 1000);
}

/* ---------- Start Workout ---------- */

function startWorkout() {
  document.body.classList.add("pulse");
  setTimeout(function () {
    document.body.classList.remove("pulse");
  }, 1200);

  if (workoutTimer) clearInterval(workoutTimer);

  var output = document.getElementById("workoutOutput");
  var timer = document.createElement("div");
  timer.id = "workoutTimer";
  output.prepend(timer);

  workoutStartTime = Date.now();

  workoutTimer = setInterval(function () {
    var elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
    var mins = Math.floor(elapsed / 60);
    var secs = elapsed % 60;

    timer.textContent =
      "TIME " +
      (mins < 10 ? "0" : "") + mins + ":" +
      (secs < 10 ? "0" : "") + secs;
  }, 1000);
}

/* ---------- Session Complete ---------- */

function showSessionComplete() {
  clearInterval(workoutTimer);

  var screen = document.createElement("div");
  screen.id = "sessionComplete";

  screen.innerHTML =
    "<h1>SESSION COMPLETE</h1>" +
    "<p>Recover. Refuel. Repeat.</p>";

  document.body.appendChild(screen);
}

/* ---------- Events ---------- */

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document
    .getElementById("startWorkoutBtn")
    .addEventListener("click", startWorkout);
});
