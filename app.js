document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     DATA
  =============================== */

  const EXERCISES = {
    bodyweight: [
      "Air Squat",
      "Push-Ups",
      "Plank",
      "Reverse Lunge"
    ],
    dumbbells: [
      "DB Goblet Squat",
      "DB Row",
      "DB Push Press",
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

  const GOALS = {
    strength: "5 reps",
    hypertrophy: "8–12 reps",
    conditioning: "12–20 reps",
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

  /* ===============================
     ACTIVE EXERCISE HANDLING
  =============================== */

  function setActiveExercise() {
    const cards = document.querySelectorAll(".exercise-card");

    cards.forEach((card, index) => {
      card.classList.toggle("active", index === exerciseIndex);
    });

    if (cards[exerciseIndex]) {
      cards[exerciseIndex].scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }

  function advanceExercise() {
    const cards = document.querySelectorAll(".exercise-card");

    if (exerciseIndex < cards.length - 1) {
      cards[exerciseIndex].classList.add("completed");
      exerciseIndex++;
      setActiveExercise();
    } else {
      showWorkoutComplete();
    }
  }

  /* ===============================
     GENERATE WORKOUT
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

    if (template && TEMPLATES[template]) {
      const t = TEMPLATES[template];
      if (t.goal) goal = t.goal;
      if (t.rounds) rounds = t.rounds;
      if (t.equipment) equipment = t.equipment;
    }

    output.innerHTML = "";
    exerciseIndex = 0;
    workoutStarted = false;

    const title = document.createElement("h3");
    title.textContent =
      `Workout – ${equipment.toUpperCase()} (${rounds} sets each)`;
    output.appendChild(title);

    EXERCISES[equipment].forEach(exercise => {
      const card = document.createElement("div");
      card.className = "exercise-card";

      const name = document.createElement("strong");
      name.textContent = exercise;
      card.appendChild(name);

      const prescription = document.createElement("p");
      prescription.textContent =
        exercise.toLowerCase().includes("carry") || exercise === "Plank"
          ? `${rounds} rounds of 30–45 seconds`
          : `${rounds} sets of ${GOALS[goal]}`;
      card.appendChild(prescription);

      // CLICK TO ADVANCE
      card.addEventListener("click", function () {
        if (!workoutStarted) return;
        advanceExercise();
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
    exerciseIndex = 0;
    setActiveExercise();
  }

  /* ===============================
     COMPLETE
  =============================== */

  function showWorkoutComplete() {
    const output = document.getElementById("workoutOutput");
    output.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "exercise-card active";

    const title = document.createElement("h3");
    title.textContent = "Workout Complete";
    wrapper.appendChild(title);

    const msg = document.createElement("p");
    msg.textContent = "Good work. Recover, refuel, and repeat.";
    wrapper.appendChild(msg);

    output.appendChild(wrapper);
  }

  /* ===============================
     EVENTS
  =============================== */

  document.getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document.getElementById("startWorkoutBtn")
    .addEventListener("click", startWorkout);

});
