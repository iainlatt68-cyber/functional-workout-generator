console.log("✅ app.js loaded");

/* ==========================
   USER PROFILE (PERSISTENT)
========================== */

function saveProfile(profile) {
  localStorage.setItem("fitnessProfile", JSON.stringify(profile));
}

function loadProfile() {
  return JSON.parse(localStorage.getItem("fitnessProfile") || "{}");
}

/* ==========================
   EXERCISE DATABASE
========================== */

var EXERCISES = [
  { name: "Air Squat", pattern: "squat", equip: "bodyweight", overhead: false, jump: false },
  { name: "Push-Ups", pattern: "push", equip: "bodyweight", overhead: false, jump: false },
  { name: "Plank", pattern: "core", equip: "bodyweight", overhead: false, jump: false, time: true },

  { name: "Goblet Squat", pattern: "squat", equip: "dumbbells", overhead: false, jump: false },
  { name: "DB Row", pattern: "pull", equip: "dumbbells", overhead: false, jump: false },
  { name: "Farmer Carry", pattern: "carry", equip: "dumbbells", overhead: false, jump: false, time: true },

  { name: "Back Squat", pattern: "squat", equip: "gym", overhead: false, jump: false },
  { name: "Pull-Ups", pattern: "pull", equip: "gym", overhead: false, jump: false },
  { name: "Push Press", pattern: "push", equip: "gym", overhead: true, jump: true }
];

/* ==========================
   GOALS & REST RULES
========================== */

var GOALS = {
  strength: { reps: "3–6 reps", rest: 90 },
  hypertrophy: { reps: "8–12 reps", rest: 60 },
  conditioning: { reps: "12–20 reps", rest: 30 },
  recovery: { reps: "Easy pace", rest: 45 }
};

/* ==========================
   WORKOUT ENGINE
========================== */

function buildWorkout(profile) {
  var patterns = ["squat", "push", "pull", "core"];
  var selected = [];

  patterns.forEach(function (pattern) {
    var options = EXERCISES.filter(function (ex) {
      if (ex.pattern !== pattern) return false;
      if (ex.equip !== profile.equipment) return false;
      if (profile.noJumping && ex.jump) return false;
      if (profile.noOverhead && ex.overhead) return false;
      return true;
    });

    if (options.length) {
      selected.push(options[Math.floor(Math.random() * options.length)]);
    }
  });

  return selected;
}

/* ==========================
   UI RENDERING
========================== */

function renderWorkout(plan, profile) {
  var output = document.getElementById("workoutOutput");
  output.innerHTML = "";

  var summary = document.createElement("div");
  summary.innerHTML =
    "<strong>Plan:</strong> " +
    profile.days + " days / " +
    profile.goal.toUpperCase();
  output.appendChild(summary);

  var completed = 0;
  var total = plan.length;

  var progress = document.createElement("p");
  progress.textContent = "Progress: 0 / " + total;
  output.appendChild(progress);

  plan.forEach(function (exercise) {
    var card = document.createElement("div");
    card.className = "exercise-card";

    var title = document.createElement("
