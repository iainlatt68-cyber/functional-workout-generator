console.log("✅ script.js is executing");

/* ===============================
   CONFIGURATION DATA
================================ */

var TIME_BASED = [
  "Plank",
  "Dead Bug",
  "Farmer Carry",
  "Bike",
  "Row Erg"
];

var WARMUP = [
  "5 min easy cardio",
  "World’s Greatest Stretch",
  "Glute activation"
];

var COOLDOWN = [
  "Hamstring stretch",
  "Hip flexor stretch",
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
    hinge: ["DB Romanian Deadlift"],
    push: ["DB Press"],
    pull: ["DB Row"],
    core: ["Farmer Carry"]
  },
  gym: {
    squat: ["Back Squat", "Leg Press"],
    hinge: ["Deadlift"],
    push: ["Bench Press"],
    pull: ["Pull-Ups"],
    core: ["Cable Chop"]
  }
};

/* ===============================
   HELPER FUNCTIONS
================================ */

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

function timeForExercise(level) {
  if (level === "beginner") return "20–30 sec";
  if (level === "intermediate") return "30–45 sec";
  return "45–60 sec";
}

function restForStyle(style) {
  if (style === "strength") return "Rest 90–120 sec";
  if (style === "conditioning") return "Rest 30–45 sec";
  if (style === "emom") return "Start every minute";
  if (style === "amrap") return "Rest as needed";
  return "";
}

function applyFatigue(text, round) {
  if (round === 1) return text;
  if (round === 2) return text + " (slightly reduce effort)";
  return text + " (reduce effort)";
}

/* ===============================
   PROGRESS TRACKING
================================ */

function updateProgress(output) {
  var total = output.querySelectorAll(".exercise-card").length;
  var done = output.querySelectorAll(".exercise-card.completed").length;
  var counter = output.querySelector(".progress-counter");

  if (counter) {
    counter.textContent = "Progress: " + done + " / " + total;
  }
}

/* ===============================
   WORKOUT GENERATION
================================ */

function generateWorkout() {
  var level = document.getElementById("level").value;
  var style = document.getElementById("style").value;
  var equipment = document.getElementById("equipment").value;
  var session = document.getElementById("session").value;
  var roundsEl = document.getElementById("rounds");
  var rounds = roundsEl ? Number(roundsEl.value) : 1;

  var output = document.getElementById("workoutOutput");
  output.innerHTML = "";

  var progress = document.createElement("p");
  progress.className = "progress-counter";
  progress.textContent = "Progress: 0 / 0";
  output.appendChild(progress);

  /* Warm‑up */
  var wh = document.createElement("h3");
  wh.textContent = "Warm‑up";
  output.appendChild(wh);

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
    rest.textContent = restForStyle(style);
    rest.style.opacity = "0.7";
    output.appendChild(rest);

    shuffle(patterns).forEach(function (pattern) {
      var list = EXERCISES[equipment][pattern];
      var exercise = shuffle(list)[0];

      var base;
      if (TIME_BASED.indexOf(exercise) !== -1) {
        base = timeForExercise(level);
      } else {
        base = repsByStyle(style);
      }

      var prescription = applyFatigue(base, r);

      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = exercise;
      card.appendChild(name);

      var p2 = document.createElement("p");
      p2.textContent = prescription;
      card.appendChild(p2);

      var btn = document.createElement("button");
      btn.textContent = "Mark complete ✅";
      btn.type = "button";
      btn.onclick = function () {
        card.classList.toggle("completed");
        updateProgress(output);
      };

      card.appendChild(btn);
      output.appendChild(card);
    });
  }

  /* Cool‑down */
  var ch = document.createElement("h3");
  ch.textContent = "Cool‑down";
  output.appendChild(ch);

  shuffle(COOLDOWN).slice(0, 2).forEach(function (c) {
    var p3 = document.createElement("p");
    p3.textContent = "• " + c;
    output.appendChild(p3);
  });

  /* Summary */
  var summary = document.createElement("div");
  summary.className = "exercise-card";

  var t = document.createElement("strong");
  t.textContent = "Workout Summary";
  summary.appendChild(t);

  [
    "Level: " + level,
    "Style: " + style,
    "Rounds: " + rounds,
    "Equipment: " + equipment,
    "Session: " + session
  ].forEach(function (lineText) {
    var line = document.createElement("p");
    line.textContent = lineText;
    summary.appendChild(line);
  });

  output.appendChild(summary);

  updateProgress(output);
}
// Theme toggle
var themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  var savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeToggle.textContent =
      savedTheme === "light" ? "🌙 Dark mode" : "☀️ Light mode";
  }

  themeToggle.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggle.textContent =
      next === "light" ? "🌙 Dark mode" : "☀️ Light mode";
  });
}
/* ===============================
   EVENT WIRING
================================ */

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM ready");

  var btn = document.getElementById("generateWorkoutBtn");
  if (!btn) {
    console.error("❌ generateWorkoutBtn not found");
    return;
  }

  btn.addEventListener("click", function () {
    console.log("✅ generateWorkout() called");
    generateWorkout();
  });
});
