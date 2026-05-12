/* =================================================
   Functional Fitness Generator - Clean Production JS
   NO alerts, NO debug popups
================================================= */

console.log("✅ app.js loaded");

/* ---------- DATA ---------- */

var EXERCISES = {
  bodyweight: ["Air Squat", "Push-Ups", "Plank"],
  dumbbells: ["Goblet Squat", "DB Row", "Farmer Carry"],
  gym: ["Back Squat", "Bench Press", "Deadlift"]
};

var GOALS = {
  strength: "3–6 reps",
  hypertrophy: "8–12 reps",
  conditioning: "12–20 reps",
  recovery: "Easy pace"
};

var workoutTimer = null;
var workoutStartTime = null;

/* ---------- GENERATE WORKOUT ---------- */

function generateWorkout() {
  console.log("▶ Generating workout");

  var goalSelect = document.getElementById("goal");
  var equipmentSelect = document.getElementById("equipment");
  var roundsSelect = document.getElementById("rounds");
  var output = document.getElementById("workoutOutput");

  // Guard clause – stops silent failure
  if (!goalSelect || !equipmentSelect || !roundsSelect || !output) {
    console.error("❌ Required elements missing");
    return;
  }

  var goal = goalSelect.value;
  var equipment = equipmentSelect.value;
  var rounds = Number(roundsSelect.value);

  output.innerHTML = "";

  var title = document.createElement("h3");
  title.textContent = "Workout (" + goal.toUpperCase() + ")";
  output.appendChild(title);

  var list = EXERCISES[equipment];

  for (var r = 1; r <= rounds; r++) {
    var roundHeader = document.createElement("h4");
    roundHeader.textContent = "Round " + r;
    output.appendChild(roundHeader);

    for (var i = 0; i < list.length; i++) {
      var exercise = list[i];

      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = exercise;
      card.appendChild(name);

      var prescription = document.createElement("p");
      prescription.textContent =
        exercise === "Plank" || exercise === "Farmer Carry"
          ? "30–45 seconds"
          : GOALS[goal];

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

/* ---------- START WORKOUT ---------- */

function startWorkout() {
  console.log("▶ Starting workout");

  if (workoutTimer) clearInterval(workoutTimer);

  var output = document.getElementById("workoutOutput");
  if (!output) return;

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

/* ---------- EVENTS ---------- */

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM ready");

  var genBtn = document.getElementById("generateWorkoutBtn");
  var startBtn = document.getElementById("startWorkoutBtn");

  if (genBtn) genBtn.addEventListener("click", generateWorkout);
  if (startBtn) startBtn.addEventListener("click", startWorkout);
});
