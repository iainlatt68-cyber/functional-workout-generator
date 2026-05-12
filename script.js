console.log("✅ script.js loaded");

/* ========= CONFIG ========= */

var TIME_BASED = [
  "Plank",
  "Side Plank",
  "Dead Bug",
  "Farmer Carry",
  "Bike",
  "Row Erg",
  "Assault Bike"
];

var WARMUP = [
  "5 min easy cardio",
  "World’s Greatest Stretch",
  "Glute activation",
  "Shoulder mobility"
];

var COOLDOWN = [
  "Hamstring stretch",
  "Hip flexor stretch",
  "Thoracic rotation",
  "Breathing – 2 min"
];

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
    hinge: ["DB RDL"],
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

/* ========= HELPERS ========= */

function shuffle(arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
}

function repsByStyle(style) {
  if (style === "strength") return "5–8 reps";
  if (style === "conditioning") return "12–15 reps";
  if (style === "emom") return "EMOM";
  if (style === "amrap") return "AMRAP";
  return "10 reps";
}

function restForStyle(style) {
  if (style === "strength") return "Rest 90–120 seconds";
  if (style === "conditioning") return "Rest 30–45 seconds";
  if (style === "emom") return "Start every minute";
  if (style === "amrap") return "Rest as needed";
  return "";
}

  function sessionOverrides(session, style) {
  if (session === "strength") return "strength";
  if (session === "hypertrophy") return "conditioning";
  if (session === "conditioning") return "amrap";
  if (session === "recovery") return "recovery";
  return style;
}
function timeForExercise(level, style, duration) {
  var min, max;

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

  if (duration === "20") {
    min += 5;
    max += 5;
  }

  if (duration === "40") {
    min += 10;
    max += 10;
  }

  return min + "–" + max + " seconds";
  
function applyFatigue(prescription, round) {
  if (round === 1) return prescription;

  var factor = round === 2 ? 0.9 : 0.8;

  if (prescription.indexOf("seconds") !== -1) {
    var parts = prescription.split("–");
    var min = Math.round(parseInt(parts[0], 10) * factor);
    var max = Math.round(parseInt(parts[1], 10) * factor);
    return min + "–" + max + " seconds";
  }

  // Rep based
  return prescription + " (reduce load/effort)";
}

/* ========= WORKOUT ========= */
function updateProgress(output) {
  var total = output.querySelectorAll(".exercise-card").length;
  var done = output.querySelectorAll(".exercise-card.completed").length;

  var counter = output.querySelector(".progress-counter");
  if (counter) {
    counter.textContent = "Progress: " + done + " / " + total;
  }
}

function generateWorkout() {
  var equipment = document.getElementById("equipment").value;
  var style = document.getElementById("style").value;
  var duration = document.getElementById("duration").value;
  var level = document.getElementById("level").value;
  var session = document.getElementById("session").value;
var effectiveStyle = sessionOverrides(session, style);
  
  var roundsEl = document.getElementById("rounds");
  var rounds = roundsEl ? Number(roundsEl.value) : 1;

  var output = document.getElementById("workoutOutput");
  output.innerHTML = "";
  var progress = document.createElement("p");
progress.className = "progress-counter";
progress.style.fontWeight = "bold";
progress.textContent = "Progress: 0 / 0";
output.appendChild(progress);

  // Warm-up
  var h = document.createElement("h3");
  h.textContent = "Warm-up";
  output.appendChild(h);

  shuffle(WARMUP).slice(0, 3).forEach(function (w) {
    var p = document.createElement("p");
    p.textContent = "• " + w;
    output.appendChild(p);
  });

  var patterns = ["squat", "hinge", "push", "pull", "core"];

  for (var r = 1; r <= rounds; r++) {
    var rh = document.createElement("h3");
    rh.textContent = rounds > 1 ? "Circuit – Round " + r : "Workout";
    output.appendChild(rh);

    var rest = document.createElement("p");
    rest.style.opacity = "0.7";
    rest.textContent = restForStyle(style);
    output.appendChild(rest);

    shuffle(patterns).forEach(function (pattern) {
      var list = EXERCISES[equipment][pattern];
      var exercise = shuffle(list)[0];

     var base;

if (TIME_BASED.indexOf(exercise) !== -1) {
  base = timeForExercise(level, style, duration);
} else {
  base = repsByStyle(style);
}

var prescription = applyFatigue(base, r);


      var card = document.createElement("div");
      card.className = "exercise-card";

      var btn = document.createElement("button");
      btn.textContent = "Mark complete ✅";
      btn.onclick = function () {
      card.classList.toggle("completed");
      btn.textContent = card.classList.contains("completed")
    ? "Completed ✅"
    : "Mark complete ✅";

  updateProgress(output);
};


      card.innerHTML =
        "<strong>" + exercise + "</strong>" +
        "<p>" + prescription + "</p>";

      card.appendChild(btn);
      output.appendChild(card);
    });
  }

  // Cooldown
  var ch = document.createElement("h3");
  ch.textContent = "Cool-down";
  output.appendChild(ch);

  shuffle(COOLDOWN).slice(0, 2).forEach(function (c) {
    var p2 = document.createElement("p");
    p2.textContent = "• " + c;
    output.appendChild(p2);
  });

  // Summary
// Summary
var summary = document.createElement("div");
summary.className = "exercise-card";

var title = document.createElement("strong");
title.textContent = "Workout Summary";
summary.appendChild(title);

var p1 = document.createElement("p");
p1.textContent = "Style: " + style.toUpperCase();
summary.appendChild(p1);

var p2 = document.createElement("p");
p2.textContent = "Rounds: " + rounds;
summary.appendChild(p2);

var p3 = document.createElement("p");
p3.textContent = "Equipment: " + equipment;
summary.appendChild(p3);

output.appendChild(summary);
}

/* ========= EVENTS ========= */

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);
});
