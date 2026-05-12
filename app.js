document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     DATA
  =============================== */

  const EXERCISES = {
    bodyweight: [
      "Air Squat",
      "Push-Ups",
      "Plank",
      "Reverse Lunge",
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
      "Barbell Row"
    ]
  };

  const GOALS = {
    strength: "3-6 reps",
    hypertrophy: "8-12 reps",
    conditioning: "12-20 reps",
    recovery: "Easy controlled reps"
  };

  const TEMPLATES = {
    burner: { goal: "conditioning", rounds: 3 },
    strength: { goal: "strength", rounds: 5 },
    grinder: { goal: "conditioning", rounds: 4, equipment: "sandbag" },
    kettle: { goal: "conditioning", rounds: 4, equipment: "kettlebell" },
    recovery: { goal: "recovery", rounds: 2 }
  };

  /* ===============================
     STATE
  =============================== */

  let activeIndex = 0;
  let workoutStarted = false;
  let restDuration = 60; // seconds

  /* ===============================
     HELPERS
  =============================== */

  function setActiveBlock() {
    const cards = document.querySelectorAll(".exercise-card");

    cards.forEach((card, idx) => {
      card.classList.toggle("active", idx === activeIndex);
    });

    if (cards[activeIndex]) {
      cards[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }

  function showRestTimer(onComplete) {
    const overlay = document.createElement("div");
    overlay.id = "restOverlay";
    document.body.appendChild(overlay);

    let remaining = restDuration;
    overlay.textContent = remaining;

    const interval = setInterval(() => {
      remaining--;
      overlay.textContent = remaining;

      if (remaining <= 0) {
        clearInterval(interval);
        overlay.remove();
        onComplete();
      }
    }, 1000);
  }
const DIFFICULTY_RULES = {
  beginner: {
    volumeMultiplier: 0.8,
    note: "Focus on learning the movements and keeping rests relaxed."
  },
  intermediate: {
    volumeMultiplier: 1,
    note: "Maintain consistent effort across the session."
  },
  advanced: {
    volumeMultiplier: 1.2,
    note: "Push the pace. Expect meaningful fatigue."
  },
  athlete: {
    volumeMultiplier: 1.4,
    note: "Treat this like competition. Quality under fatigue matters."
  }
};
  /* ===============================
     GENERATE WORKOUT
  =============================== */
const difficulty = document.getElementById("difficulty").value;
const difficultyRule = DIFFICULTY_RULES[difficulty];
  function generateWorkout() {
    const goalEl = document.getElementById("goal");
    const equipmentEl = document.getElementById("equipment");
    const roundsEl = document.getElementById("rounds");
    const templateEl = document.getElementById("template");
    const output = document.getElementById("workoutOutput");

    let goal = goalEl.value;
    let equipment = equipmentEl.value;
    let baseRounds = Number(roundsEl.value);
    let rounds = Math.max(
  1,
  Math.round(baseRounds * difficultyRule.volumeMultiplier)
);

    const template = templateEl.value;

    // Apply template overrides
    if (template && TEMPLATES[template]) {
      const t = TEMPLATES[template];
      if (t.goal) goal = t.goal;
      if (t.rounds) rounds = t.rounds;
      if (t.equipment) equipment = t.equipment;
    }

    output.innerHTML = "";
    workoutStarted = false;
    activeIndex = 0;

    const title = document.createElement("h3");
    title.textContent =
      "Workout (" + goal.toUpperCase() + " / " + equipment.toUpperCase() + ")";
    output.appendChild(title);

    const list = EXERCISES[equipment];

    list.forEach(exercise => {
      const card = document.createElement("div");
      card.className = "exercise-card";

      const name = document.createElement("strong");
      name.textContent = exercise;
      card.appendChild(name);

      const prescription = document.createElement("p");
      prescription.textContent =
        exercise.toLowerCase().includes("carry") || exercise === "Plank"
          ? "30-45 seconds"
          : GOALS[goal];
      card.appendChild(prescription);

      const roundsText = document.createElement("p");
      roundsText.textContent = "Complete " + rounds + " rounds";
      roundsText.style.fontSize = "0.85rem";
      roundsText.style.opacity = "0.8";
      card.appendChild(roundsText);

      // Click to complete exercise and start rest
      card.addEventListener("click", function () {
        if (!workoutStarted) return;
        if (!card.classList.contains("active")) return;

        card.classList.add("completed");
        card.classList.remove("active");

        showRestTimer(() => {
          activeIndex++;
          const allCards = document.querySelectorAll(".exercise-card");

          if (activeIndex < allCards.length) {
            setActiveBlock();
          } else {
            showSessionComplete(goal, equipment, rounds);
          }
        });
      });

      output.appendChild(card);
    });
  }

  /* ===============================
     START WORKOUT
  =============================== */

  function startWorkout() {
    const cards = document.querySelectorAll(".exercise-card");

    if (!cards.length) {
      alert("Generate a workout first.");
      return;
    }

    workoutStarted = true;
    activeIndex = 0;
    setActiveBlock();
  }

  /* ===============================
     SESSION COMPLETE
  =============================== */

  function showSessionComplete(goal, equipment, rounds) {
    const output = document.getElementById("workoutOutput");
    output.innerHTML = "";

    const card = document.createElement("div");
    card.className = "exercise-card active";

    const title = document.createElement("h3");
    title.textContent = "Workout Complete";
    card.appendChild(title);

    const summary = document.createElement("p");
    summary.textContent =
      "Goal: " + goal +
      " | Equipment: " + equipment +
      " | Rounds per exercise: " + rounds;
    card.appendChild(summary);

    output.appendChild(card);
  }

  /* ===============================
     EVENTS
  =============================== */

  document
    .getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document
    .getElementById("startWorkoutBtn")
    .addEventListener("click", startWorkout);

});
