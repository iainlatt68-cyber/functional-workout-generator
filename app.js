/* =====================================================
   Functional Fitness Generator – Equipment + Templates
===================================================== */

var EXERCISES = {
  bodyweight: [
    "Air Squat",
    "Push-Ups",
    "Plank",
    "Lunges",
    "Mountain Climbers"
  ],
  dumbbells: [
    "DB Goblet Squat",
    "DB Row",
    "DB Push Press",
    "DB RDL",
    "Farmer Carry"
  ],
  kettlebell: [
    "KB Swing",
    "KB Goblet Squat",
    "KB Clean",
    "KB Press",
    "KB Reverse Lunge"
  ],
  sandbag: [
    "Sandbag Clean",
    "Sandbag Front Squat",
    "Sandbag Carry",
    "Sandbag Shouldering",
    "Sandbag Reverse Lunge"
  ],
  gym: [
    "Back Squat",
    "Bench Press",
    "Deadlift",
    "Pull-Ups",
    "Row"
  ]
};

var GOALS = {
  strength: "3–6 reps",
  hypertrophy: "8–12 reps",
  conditioning: "12–20 reps",
  recovery: "Easy controlled reps"
};

var TEMPLATES = {
  burner: {
    goal: "conditioning",
    mode: "amrap",
    rounds: 3
  },
  strength: {
    goal: "strength",
    mode: "normal",
    rounds: 5
  },
  grinder: {
    goal: "conditioning",
    mode: "emom",
    rounds: 4
  },
  kettle: {
    goal: "conditioning",
    mode: "normal",
    rounds: 4,
    forceEquipment: "kettlebell"
  },
  recovery: {
    goal: "recovery",
    mode: "normal",
    rounds: 2
  }
};

var workoutTimer = null;
var workoutStart = null;
var exerciseIndex = 0;

/* ---------- TEMPLATE HANDLING ---------- */

document.getElementById("template").addEventListener("change", function () {
  var t = TEMPLATES[this.value];
  if (!t) return;

  if (t.goal) goal.value = t.goal;
  if (t.mode) mode.value = t.mode;
  if (t.rounds) rounds.value = t.rounds;
  if (t.forceEquipment) equipment.value = t.forceEquipment;
});

/* ---------- GENERATE WORKOUT ---------- */

function generateWorkout() {
  clearInterval(workoutTimer);

  var selectedGoal = goal.value;
  var selectedEquipment = equipment.value;
  var selectedRounds = Number(rounds.value);
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";
  exerciseIndex = 0;

  var title = document.createElement("h3");
  title.textContent =
    "Workout – " +
    selectedEquipment.toUpperCase() +
    " (" +
    selectedGoal.toUpperCase() +
    ")";
  output.appendChild(title);

  var list = EXERCISES[selectedEquipment];

  for (var r = 1; r <= selectedRounds; r++) {
    var rh = document.createElement("h4");
    rh.textContent = "Round " + r;
    output.appendChild(rh);

    list.forEach(function (exercise) {
      renderExercise(exercise, selectedGoal, output);
    });
  }

  setActiveExercise();
}

/* ---------- RENDER ---------- */

function renderExercise(name, goal, out) {
  var card = document.createElement("div");
  card.className = "exercise-card";

  var strong = document.createElement("strong");
  strong.textContent = name;
  card.appendChild(strong);

  var p = document.createElement("p");
  p.textContent =
    name.toLowerCase().includes("carry") || name === "Plank"
      ? "30–45 seconds"
      : GOALS[goal];
  card.appendChild(p);

  var btn = document.createElement("button");
  btn.textContent = "Complete";

  btn.onclick = function () {
    card.classList.add("completed");
    card.classList.remove("active");
    exerciseIndex++;
    setActiveExercise();
  };

  card.appendChild(btn);
  out.appendChild(card);
}

/* ---------- ACTIVE EXERCISE ---------- */

function setActiveExercise() {
  var cards = document.querySelectorAll(".exercise-card");

  if (exerciseIndex >= cards.length) {
    showSessionComplete();
    return;
  }

  cards.forEach(function (card, i) {
    card.classList.toggle("active", i === exerciseIndex);
  });

  cards[exerciseIndex].scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

/* ---------- TIMER ---------- */

function startWorkout() {
  clearInterval(workoutTimer);
  workoutStart = Date.now();

  var out = document.getElementById("workoutOutput");
  var timer = document.createElement("div");
  timer.id = "workoutTimer";
  out.prepend(timer);

  workoutTimer = setInterval(function () {
    var t = Math.floor((Date.now() - workoutStart) / 1000);
    var m = Math.floor(t / 60);
    var s = t % 60;
    timer.textContent = "TIME " + m + ":" + (s < 10 ? "0" : "") + s;
  }, 1000);
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
  generateWorkoutBtn.onclick = generateWorkout;
  startWorkoutBtn.onclick = startWorkout;
});
