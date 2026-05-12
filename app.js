/* =================================================
   Functional Fitness Generator
   Modes: Normal • EMOM • AMRAP
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
var emomMinute = 0;
var amrapReps = 0;

/* ---------- GENERATE WORKOUT ---------- */

function generateWorkout() {
  clearInterval(workoutTimer);

  var goal = document.getElementById("goal").value;
  var equipment = document.getElementById("equipment").value;
  var rounds = Number(document.getElementById("rounds").value);
  var mode = document.getElementById("mode").value;
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";
  exerciseIndex = 0;
  emomMinute = 0;
  amrapReps = 0;

  var title = document.createElement("h3");
  title.textContent = "Workout (" + mode.toUpperCase() + ")";
  output.appendChild(title);

  var exercises = EXERCISES[equipment];

  if (mode === "emom") {
    startEMOM(exercises, rounds);
    return;
  }

  if (mode === "amrap") {
    startAMRAP(exercises);
    return;
  }

  // ---- NORMAL MODE ----
  for (var r = 1; r <= rounds; r++) {
    var rh = document.createElement("h4");
    rh.textContent = "Round " + r;
    output.appendChild(rh);

    exercises.forEach(function (exercise) {
      renderExercise(exercise, goal, output);
    });
  }

  setActiveExercise();
}

/* ---------- RENDER EXERCISE ---------- */

function renderExercise(exercise, goal, container) {
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
  btn.textContent = "Complete";

  btn.onclick = function () {
    card.classList.add("completed");
    card.classList.remove("active");
    exerciseIndex++;
    showRest();
  };

  card.appendChild(btn);
  container.appendChild(card);
}

/* ---------- ACTIVE EXERCISE ---------- */

function setActiveExercise() {
  var cards = document.querySelectorAll(".exercise-card");
  cards.forEach(function (card, i) {
    card.classList.toggle("active", i === exerciseIndex);
  });

  if (exerciseIndex >= cards.length) {
    showSessionComplete();
  }
}

/* ---------- REST ---------- */

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

/* ---------- START TIMER ---------- */

function startWorkout() {
  document.body.classList.add("pulse");
  setTimeout(function () {
    document.body.classList.remove("pulse");
  }, 1200);

  clearInterval(workoutTimer);

  var output = document.getElementById("workoutOutput");
  var timer = document.createElement("div");
  timer.id = "workoutTimer";

  output.prepend(timer);
  workoutStartTime = Date.now();

  workoutTimer = setInterval(function () {
    var elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
    var min = Math.floor(elapsed / 60);
    var sec = elapsed % 60;

    timer.textContent =
      "TIME " +
      (min < 10 ? "0" : "") + min + ":" +
      (sec < 10 ? "0" : "") + sec;
  }, 1000);
}

/* ---------- EMOM ---------- */

function startEMOM(exercises, minutes) {
  var output = document.getElementById("workoutOutput");

  var display = document.createElement("div");
  display.className = "exercise-card active";
  output.appendChild(display);

  emomMinute = 0;
  startWorkout();

  function nextMinute() {
    if (emomMinute >= minutes) {
      showSessionComplete();
      return;
    }

    var exercise = exercises[emomMinute % exercises.length];
    emomMinute++;

    display.innerHTML =
      "<strong>Minute " + emomMinute + "</strong>" +
      "<p>" + exercise + "</p>";

    showRest();
  }

  nextMinute();

  workoutTimer = setInterval(function () {
    var elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
    if (elapsed % 60 === 0) nextMinute();
  }, 1000);
}

/* ---------- AMRAP ---------- */

function startAMRAP(exercises) {
  var output = document.getElementById("workoutOutput");

  var card = document.createElement("div");
  card.className = "exercise-card active";
  output.appendChild(card);

  card.innerHTML =
    "<strong>AMRAP</strong>" +
    "<p>Complete as many rounds as possible in 10 minutes</p>";

  startWorkout();

  workoutTimer = setInterval(function () {
    var elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);

    if (elapsed >= 600) {
      showSessionComplete();
      clearInterval(workoutTimer);
    }
  }, 1000);

  card.onclick = function () {
    amrapReps++;
    card.querySelector("p").textContent =
      "Reps completed: " + amrapReps;
  };
}

/* ---------- COMPLETE ---------- */

function showSessionComplete() {
  clearInterval(workoutTimer);

  var screen = document.createElement("div");
  screen.id = "sessionComplete";
  screen.innerHTML =
    "<h1>SESSION COMPLETE</h1><p>Recover. Refuel. Repeat.</p>";

  document.body.appendChild(screen);
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
