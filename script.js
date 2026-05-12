console.log("✅ script.js loaded");

/* ===============================
   EXERCISES BY MOVEMENT PATTERN
================================ */
var EXERCISES = {
  bodyweight: {
    squat: ["Air Squat", "Split Squat"],
    hinge: ["Glute Bridge"],
    push: ["Push-Ups"],
    pull: ["Inverted Row"],
    core: ["Plank", "Dead Bug"]
  },

  dumbbells: {
    squat: ["Goblet Squat"],
    hinge: ["DB Romanian Deadlift"],
    push: ["DB Press"],
    pull: ["DB Row"],
    core: ["Farmer Carry"]
  },

  gym: {
    squat: ["Back Squat", "Leg Press"],
    hinge: ["Deadlift", "RDL"],
    push: ["Bench Press", "Push Press"],
    pull: ["Pull-Ups", "Seated Row"],
    core: ["Cable Chop", "Hanging Knee Raise"]
  }
};

/* ===============================
   WARM‑UP & COOL‑DOWN
================================ */
var WARMUP = [
  "5 min easy cardio",
  "World’s Greatest Stretch",
  "Glute Activation",
  "Shoulder Mobility"
];

var COOLDOWN = [
  "Hamstring Stretch",
  "Hip Flexor Stretch",
  "Thoracic Rotation",
  "Breathing – 2 min"
];
/* ===============================
   TIME‑BASED EXERCISES
================================ */
var TIME_BASED = [
  "Plank",
  "Side Plank",
  "Dead Bug",
  "Farmer Carry",
  "Bike",
  "Row Erg",
  "Assault Bike",
  "Treadmill Walk",
  "Breathing"
];
/* ===============================
   HELPERS
================================ */
function shuffle(arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
}

function repsByStyle(style) {
  if (style === "strength") return "5–8 reps";
  if (style === "conditioning") return "12–15 reps";
  if (style === "emom") return "EMOM × 10 min";
  if (style === "amrap") return "AMRAP × 15 min";
  return "10 reps";
}

function timeForExercise(level, style, duration) {
  var base;

  // Base by fitness level
  if (level === "beginner") base = 20;
  else if (level === "intermediate") base = 30;
  else base = 40;

  // Adjust by workout style
  if (style === "conditioning") base += 10;
  if (style === "emom") base = 40;
  if (style === "amrap") base = 45;

  // Adjust by workout length
  if (duration === "20") base += 5;
  if (duration === "40") base += 10;

  return base + " seconds";
}
/* ===============================
   WORKOUT GENERATOR
================================ */
function generateWorkout() {
  var equipment = document.getElementById("equipment").value;
  var style = document.getElementById("style").value;
  var roundsEl = document.getElementById("rounds");
  var rounds = roundsEl ? Number(roundsEl.value) : 1;
  var output = document.getElementById("workoutOutput");

  output.innerHTML = "";

  /* Warm‑up */
  var h = document.createElement("h3");
  h.textContent = "Warm‑up";
  output.appendChild(h);

  shuffle(WARMUP).slice(0, 3).forEach(function (item) {
    var p = document.createElement("p");
    p.textContent = "• " + item;
    output.appendChild(p);
  });

  var patterns = ["squat", "hinge", "push", "pull", "core"];
  var reps = repsByStyle(style);
var useTimeFor = function (exercise) {
  return TIME_BASED.indexOf(exercise) !== -1;
};

  for (var r = 1; r <= rounds; r++) {
    var rh = document.createElement("h3");
    rh.textContent = rounds > 1 ? "Circuit – Round " + r : "Workout";
    output.appendChild(rh);

    shuffle(patterns).forEach(function (pattern) {
  var list = EXERCISES[equipment][pattern];
  var exercise = shuffle(list)[0];

  var prescription;
  if (useTimeFor(exercise)) {
    prescription = timeForExercise(level, style, duration);
  } else {
    prescription = reps;
  }

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
    "<strong>" + exercise + "</strong>" +
    "<p>" + prescription + "</p>";

  card.appendChild(btn);
  output.appendChild(card);
});
if (useTimeFor(exercise)) {
  prescription = timeForExercise(level, style, duration);
} else {
  prescription = reps;
}

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
  "<strong>" + exercise + "</strong>" +
  "<p>" + prescription + "</p>";


      card.appendChild(btn);
      output.appendChild(card);
    });
  }

  /* Cool‑down */
  var ch = document.createElement("h3");
  ch.textContent = "Cool‑down";
  output.appendChild(ch);

  shuffle(COOLDOWN).slice(0, 2).forEach(function (item) {
    var p2 = document.createElement("p");
    p2.textContent = "• " + item;
    output.appendChild(p2);
  });
}

/* ===============================
   TIMER
================================ */
var timerId;
var timeLeft = 0;

function startTimer() {
  clearInterval(timerId);
  var timer = document.getElementById("timer");
  timeLeft = 45;
  timer.textContent = timeLeft + " sec rest";

  timerId = setInterval(function () {
    timeLeft--;
    timer.textContent = timeLeft + " sec rest";
    if (timeLeft <= 0) {
      clearInterval(timerId);
      timer.textContent = "Rest complete ✅";
    }
  }, 1000);
}

/* ===============================
   EVENTS
================================ */
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document
    .getElementById("startTimerBtn")
    .addEventListener("click", startTimer);
});
