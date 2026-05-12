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

  let exerciseIndex = 0;
  let workoutStarted = false;
  let workoutTimer = null;
  let workoutStartTime = null;

  /* ===============================
     UTILITIES
  =============================== */

  function setActiveExercise() {
    const cards = document.querySelectorAll(".exercise-card");

    cards.forEach((card, index) => {
      card.classList.toggle("active", index === exerciseIndex);
    });

    // Auto-scroll to active exercise
    if (cards[exerciseIndex]) {
      cards[exerciseIndex].scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }

  function clearActiveExercises() {
    document
      .querySelectorAll(".exercise-card")
      .forEach(card => card.classList.remove("active"));
  }

  /* ===============================
     WORKOUT GENERATION
  =============================== */

  function generateWorkout() {
    const goalEl = document.getElementById("goal");
    const equipmentEl = document.getElementById("equipment");
    const roundsEl = document.getElementById("rounds");
    const templateEl = document.getElementById("template");
    const output = document.getElementById("workoutOutput");

    let goal = goalEl.value;
    let equipment = equipmentEl.value;
    let rounds = Number(roundsEl.value);
    const template = templateEl.value;

    // Apply template overrides
    if (template && TEMPLATES[template]) {
      const t = TEMPLATES[template];
      if (t.goal) goal = t.goal;
      if (t.rounds) rounds = t.rounds;
      if (t.equipment) equipment = t.equipment;
    }

    // Reset state
    workoutStarted = false;
    exerciseIndex = 0;
    clearActiveExercises();

    output.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent =
      `Workout (${goal.toUpperCase()} / ${equipment.toUpperCase()})`;
    output.appendChild(title);

    const list = EXERCISES[equipment];

    for (let r = 1; r <= rounds; r++) {
      const roundHeader = document.createElement("h4");
      roundHeader.textContent = `Round ${r}`;
      output.appendChild(roundHeader);

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

        output.appendChild(card);
      });
    }
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

    if (workoutStarted) return;

    workoutStarted = true;
    exerciseIndex = 0;

    // Activate first exercise
    setActiveExercise();

    // Start timer (simple)
    workoutStartTime = Date.now();
    workoutTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
      console.log("Workout time:", elapsed, "seconds");
    }, 1000);
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
