/* =====================================================
   PERFORMANCE WORKOUT ENGINE
   Features:
   - Auto-scroll + active lock
   - EMOM / AMRAP / Standard
   - Repeat last workout
   - Personal bests
   - Effort score + weekly load
   - Workout templates
   - Block-based sessions
   - Coach notes
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

/* ---------- STORAGE ---------- */
function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function load(key, fallback) {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
}

/* ---------- STATE ---------- */
var workoutTimer = null;
var workoutStart = null;
var exerciseIndex = 0;
var completed = 0;
var total = 0;
var sessionLog = [];

/* ---------- AUTOSCROLL ---------- */
function focusActive() {
  var active = document.querySelector(".exercise-card.active");
  if (!active) return;
  active.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ---------- ACTIVE LOGIC ---------- */
function setActive() {
  var cards = document.querySelectorAll(".exercise-card");
  cards.forEach(function (c, i) {
    c.classList.toggle("active", i === exerciseIndex);
  });
  focusActive();
}

/* ---------- TIMER ---------- */
function startTimer() {
  clearInterval(workoutTimer);
  workoutStart = Date.now();

  var timer = document.getElementById("workoutTimer");
  if (!timer) {
    timer = document.createElement("div");
    timer.id = "workoutTimer";
    document.getElementById("workoutOutput").prepend(timer);
  }

  workoutTimer = setInterval(function () {
    var t = Math.floor((Date.now() - workoutStart) / 1000);
    var m = Math.floor(t / 60);
    var s = t % 60;
    timer.textContent =
      "TIME " +
      (m < 10 ? "0" : "") + m + ":" +
      (s < 10 ? "0" : "") + s;
  }, 1000);
}

/* ---------- REST ---------- */
function restOverlay() {
  var o = document.createElement("div");
  o.id = "restOverlay";
  document.body.appendChild(o);

  var t = 30;
  o.textContent = t;

  var i = setInterval(function () {
    t--;
    o.textContent = t;
    if (t <= 0) {
      clearInterval(i);
      o.remove();
      setActive();
    }
  }, 1000);
}

/* ---------- SESSION COMPLETE ---------- */
function endSession(goal) {
  clearInterval(workoutTimer);
  var elapsed = Math.floor((Date.now() - workoutStart) / 1000);

  var effort = prompt("Rate effort 1-10");
  var effortScore = elapsed / 60 * (Number(effort) || 5);

  var history = load("workoutHistory", []);
  history.push({
    date: new Date().toLocaleDateString(),
    goal: goal,
    duration: elapsed,
    effort: effortScore
  });
  save("workoutHistory", history);

  // Personal bests
  var bests = load("bests", {});
  if (!bests.fastest || elapsed < bests.fastest) {
    bests.fastest = elapsed;
  }
  save("bests", bests);

  var screen = document.createElement("div");
  screen.id = "sessionComplete";
  screen.innerHTML =
    "<h1>SESSION COMPLETE</h1>" +
    "<p>Effort score: " + effortScore.toFixed(1) + "</p>";

  if (bests.fastest === elapsed) {
    screen.innerHTML += "<p>NEW FASTEST SESSION</p>";
  }

  document.body.appendChild(screen);
}

/* ---------- RENDER ---------- */
function renderExercise(name, goal, out) {
  var c = document.createElement("div");
  c.className = "exercise-card";

  var s = document.createElement("strong");
  s.textContent = name;
  c.appendChild(s);

  var p = document.createElement("p");
  p.textContent =
    name === "Plank" || name === "Farmer Carry"
      ? "30-45 seconds"
      : GOALS[goal];
  c.appendChild(p);

  var b = document.createElement("button");
  b.textContent = "Complete";
  b.onclick = function () {
    if (c.classList.contains("completed")) return;
    c.classList.add("completed");
    completed++;
    exerciseIndex++;
    restOverlay();
    if (exerciseIndex >= total) endSession(goal);
  };

  c.appendChild(b);
  out.appendChild(c);
}

/* ---------- GENERATE ---------- */
function generateWorkout(config) {
  var out = document.getElementById("workoutOutput");
  out.innerHTML = "";

  exerciseIndex = 0;
  completed = 0;

  var goal = config.goal;
  var eq = EXERCISES[config.equipment];

  total = config.rounds * eq.length;

  var h = document.createElement("h3");
  h.textContent = config.template || goal.toUpperCase();
  out.appendChild(h);

  for (var r = 1; r <= config.rounds; r++) {
    eq.forEach(function (ex) {
      renderExercise(ex, goal, out);
    });
  }

  setActive();
}

/* ---------- TEMPLATES ---------- */
var templates = {
  burner: { goal: "conditioning", rounds: 3, equipment: "bodyweight", template: "Conditioning Burner" },
  strength: { goal: "strength", rounds: 4, equipment: "gym", template: "Strength Block" }
};

/* ---------- EVENTS ---------- */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("generateWorkoutBtn").onclick = function () {
    var cfg = {
      goal: goal.value,
      rounds: Number(rounds.value),
      equipment: equipment.value
    };
    save("lastWorkout
