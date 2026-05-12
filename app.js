/* =====================================================
   Functional Fitness Generator
   CLEAN PRODUCTION BUILD
===================================================== */

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
var workoutStart = null;
var exerciseIndex = 0;

/* ---------- Generate Workout ---------- */

function generateWorkout() {
  clearInterval(workoutTimer);

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
    var rh = document.createElement("h4");
    rh.textContent = "Round " + r;
    output.appendChild(rh);

    for (var i = 0; i < list.length; i++) {
      renderExercise(list[i], goal, output);
    }
  }

  setActiveExercise();
}

/* ---------- Render Exercise ---------- */

function renderExercise(name, goal, container) {
  var card = document.createElement("div");
  card.className = "exercise-card";

  var strong = document.createElement("strong");
  strong.textContent = name;
  card.appendChild(strong);

  var p = document.createElement("p");
  if (name === "Plank" || name === "Farmer Carry") {
    p.textContent = "30-45 seconds";
  } else {
    p.textContent = GOALS[goal];
  }
  card.appendChild(p);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Complete";

  btn.onclick = function () {
    if (card.classList.contains("completed")) return;
    card.classList.add("completed");
    card.classList.remove("active");
    exerciseIndex++;
    showRest();
  };

  card.appendChild(btn);
  container.appendChild(card);
}

/* ---------- Active Focus ---------- */

function setActiveExercise() {
  var cards = document.querySelectorAll(".exercise-card");

  if (exerciseIndex >= cards.length) {
    showSessionComplete();
    return;
  }

  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.toggle("active", i === exerciseIndex);
  }

  var active = cards[exerciseIndex];
  if (active) {
    active.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* ---------- Rest Overlay ---------- */

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

/* ---------- Timer ---------- */

function startWorkout() {
  clearInterval(workoutTimer);
  workoutStart = Date.now();

  var output = document.getElementById("workoutOutput");
  var timer = document.createElement("div");
  timer.id = "workoutTimer";
  output.prepend(timer);

  workoutTimer = setInterval(function () {
    var elapsed = Math.floor((Date.now() - workoutStart) / 1000);
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

  var h1 = document.createElement("h1");
  h1.textContent = "SESSION COMPLETE";

  var p = document.createElement("p");
  p.textContent = "Recover. Refuel. Repeat.";

  screen.appendChild(h1);
  screen.appendChild(p);

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
