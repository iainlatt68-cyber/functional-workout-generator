/* ===============================================
   Functional Fitness Generator
   Stable build
=============================================== */

var EXERCISES = {
  bodyweight: [
    "Air Squat",
    "Push-Ups",
    "Plank",
    "Lunges"
  ],
  dumbbells: [
    "DB Goblet Squat",
    "DB Row",
    "DB Press",
    "Farmer Carry"
  ],
  kettlebell: [
    "KB Swing",
    "KB Goblet Squat",
    "KB Clean",
    "KB Press"
  ],
  sandbag: [
    "Sandbag Clean",
    "Sandbag Front Squat",
    "Sandbag Carry",
    "Sandbag Shouldering"
  ],
  gym: [
    "Back Squat",
    "Bench Press",
    "Deadlift",
    "Pull-Ups"
  ]
};

var GOALS = {
  strength: "3–6 reps",
  hypertrophy: "8–12 reps",
  conditioning: "12–20 reps",
  recovery: "Easy controlled reps"
};

var TEMPLATES = {
  burner: { goal: "conditioning", rounds: 3 },
  strength: { goal: "strength", rounds: 5 },
  grinder: { goal: "conditioning", rounds: 4, equipment: "sandbag" },
  kettle: { goal: "conditioning", rounds: 4, equipment: "kettlebell" },
  recovery: { goal: "recovery", rounds: 2 }
};

function generateWorkout() {
  var goalEl = document.getElementById("goal");
  var equipEl = document.getElementById("equipment");
  var roundsEl = document.getElementById("rounds");
  var templateEl = document.getElementById("template");
  var output = document.getElementById("workoutOutput");

  var goal = goalEl.value;
  var equipment = equipEl.value;
  var rounds = Number(roundsEl.value);
  var template = templateEl.value;

  // ✅ Apply template if selected
  if (template && TEMPLATES[template]) {
    var t = TEMPLATES[template];
    goal = t.goal || goal;
    rounds = t.rounds || rounds;
    if (t.equipment) equipment = t.equipment;
  }

  output.innerHTML = "";

  var title = document.createElement("h3");
  title.textContent = "Workout (" + equipment + " / " + goal + ")";
  output.appendChild(title);

  var list = EXERCISES[equipment];

  for (var r = 1; r <= rounds; r++) {
    var rh = document.createElement("h4");
    rh.textContent = "Round " + r;
    output.appendChild(rh);

    list.forEach(function (exercise) {
      var card = document.createElement("div");
      card.className = "exercise-card";

      var name = document.createElement("strong");
      name.textContent = exercise;
      card.appendChild(name);

      var p = document.createElement("p");
      p.textContent =
        exercise.toLowerCase().includes("carry") || exercise === "Plank"
          ? "30–45 seconds"
          : GOALS[goal];
      card.appendChild(p);

      var btn = document.createElement("button");
      btn.textContent = "Complete";
      btn.onclick = function () {
        card.classList.toggle("completed");
      };

      card.appendChild(btn);
      output.appendChild(card);
    });
  }
}

function startWorkout() {
  console.log("Workout started");
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document
    .getElementById("startWorkoutBtn")
    .addEventListener("click", startWorkout);
});
