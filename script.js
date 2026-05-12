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

function restForStyle(style) {
  if (style === "strength") return "Rest 90–120 seconds";
  if (style === "conditioning") return "Rest 30–45 seconds";
  if (style === "emom") return "Start each set on the minute";
  if (style === "amrap") return "Rest as needed";
  return "";
}
/* ===============================
   WORKOUT GENERATOR
================================ */
function generateWorkout() {
  var equipment = document.getElementById("equipment").value;
  var style = document.getElementById("style").value;
  var duration = document.getElementById("duration").value;

  var roundsEl = document.getElementById("rounds");
  var rounds = roundsEl ? Number(roundsEl.value) : 1;

  var output = document.getElementById("workoutOutput");
  output.innerHTML = "";

  /* Warm-up */
  var wh = document.createElement("h3");
  wh.textContent = "Warm‑up";
  output.appendChild(wh);

  shuffle(WARMUP).slice(0, 3).forEach(function (item) {
    var p = document.createElement("p");
    p.textContent = "• " + item;
    output.appendChild(p);
  });

  var patterns = ["squat", "hinge", "push", "pull", "core"];

  for (var r = 1; r <= rounds; r++) {
 var rh = document.createElement("h3");
rh.textContent = rounds > 1 ? "Circuit – Round " + r : "Workout";
output.appendChild(rh);

var restNote = document.createElement("p");
restNote.style.fontSize = "14px";
restNote.style.opacity = "0.8";
restNote.textContent = restForStyle(style);
output.appendChild(restNote);
``

    shuffle(patterns).forEach(function (pattern) {
      var list = EXERCISES[equipment][pattern];
      var exercise = shuffle(list)[0];

function timeForExercise(level, style, duration) {
  var min;
  var max;

  // Base by level
  if (level === "beginner") {
    min = 20;
    max = 30;
  } else if (level === "intermediate") {
    min = 30;
    max = 45;
  } else {
    min = 45;
    max = 60;
  }

  // Adjust by workout style
  if (style === "conditioning") {
    min += 5;
    max += 10;
  }

  if (style === "emom") {
    min = 40;
    max = 40;
  }

  if (style === "amrap") {
    min = 45;
    max = 60;
  }

  // Adjust by workout length
  if (duration === "20") {
    min += 5;
    max += 5;
  }

  if (duration === "40") {
    min += 10;
    max += 10;
  }

  return min + "–" + max + " seconds";
}
      }

      var card = document.createElement("div");
      card.className = "exercise-card";

      var btn = document.createElement("button");
      btn.textContent = "Mark complete ✅";
      btn.onclick = function () {
        card.classList.toggle("completed");
        btn.textContent = card.classList.contains("completed")
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

  /* Cool-down */
  var ch = document.createElement("h3");
  ch.textContent = "Cool‑down";
  output.appendChild(ch);

  shuffle(COOLDOWN).slice(0, 2).forEach(function (item) {
    var p2 = document.createElement("p");
    p2.textContent = "• " + item;
    output.appendChild(p2);
  });
}
// Workout Summary
var summary = document.createElement("div");
summary.className = "exercise-card";

var estTime;
if (style === "strength") estTime = rounds * 12 + "–" + rounds * 15 + " min";
else if (style === "conditioning") estTime = rounds * 8 + "–" + rounds * 10 + " min";
else if (style === "emom") estTime = "10–15 min";
else estTime = "15–20 min";

summary.innerHTML =
  "<strong>Workout Summary</strong>" +
  "<p>Style: " + style.toUpperCase() + "</p>" +
  "<p>Rounds: " + rounds + "</p>" +
  "<p>Equipment: " + equipment + "</p>" +
  "<p>Estimated time: " + estTime + "</p>";

output.appendChild(summary);
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
