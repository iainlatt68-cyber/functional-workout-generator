
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
    burner: {
      goal: "conditioning",
      rounds: 3
    },
    strength: {
      goal: "strength",
      rounds: 5
    },
    grinder: {
      goal: "conditioning",
      rounds: 4,
      equipment: "sandbag"
    },
    kettle: {
      goal: "conditioning",
      rounds: 4,
      equipment: "kettlebell"
    },
    recovery: {
      goal: "recovery",
      rounds: 2
    }
  };

  /* ===============================
     COACHING NOTES
  =============================== */

  function getCoachingNotes(goal, equipment, rounds) {
    const notes = [];

    if (goal === "strength") {
      notes.push("Prioritise tight technique and full rest between sets.");
      notes.push("If reps slowed noticeably, keep load the same next time.");
    }

    if (goal === "conditioning") {
      notes.push("Consistent pacing beats early intensity.");
      notes.push("If breathing recovered quickly, consider adding a round next session.");
    }

    if (goal === "hypertrophy") {
      notes.push("Control the tempo and aim for muscular fatigue, not failure.");
      notes.push("Minor muscle soreness is expected; joint pain is not.");
    }

    if (goal === "recovery") {
      notes.push("This session should leave you feeling refreshed, not exhausted.");
      notes.push("Reduce volume further if fatigue carried into the next day.");
    }

    if (equipment === "kettlebell") {
      notes.push("Use the hips to drive power. The arms guide, not lift.");
    }

    if (equipment === "sandbag") {
      notes.push("Stay braced and move deliberately. Instability is the stimulus.");
    }

    if (rounds >= 4) {
      notes.push("Training volume was high. Focus on hydration, calories, and sleep.");
    }

    return notes;
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

    output.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = "Workout (" + goal.toUpperCase() + " / " + equipment.toUpperCase() + ")";
    output.appendChild(title);

    const list = EXERCISES[equipment];

    for (let r = 1; r <= rounds; r++) {
      const roundHeader = document.createElement("h4");
      roundHeader.textContent = "Round " + r;
      output.appendChild(roundHeader);

      list.forEach(function (exercise) {
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

    // Finish button
    const finishBtn = document.createElement("button");
    finishBtn.textContent = "Finish Workout";
    finishBtn.style.marginTop = "16px";
    finishBtn.onclick = function () {
      showSessionComplete(goal, equipment, rounds);
    };

    output.appendChild(finishBtn);
  }

  /* ===============================
     SESSION COMPLETE
  =============================== */

  function showSessionComplete(goal, equipment, rounds) {
    const output = document.getElementById("workoutOutput");
    output.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "exercise-card active";

    const title = document.createElement("h3");
    title.textContent = "Workout Complete";
    wrapper.appendChild(title);

    const summary = document.createElement("p");
    summary.textContent =
      "Goal: " + goal.toUpperCase() +
      " | Equipment: " + equipment +
      " | Rounds: " + rounds;
    wrapper.appendChild(summary);

    const notesTitle = document.createElement("h4");
    notesTitle.textContent = "Coach Notes";
    wrapper.appendChild(notesTitle);

    const notes = getCoachingNotes(goal, equipment, rounds);
    const ul = document.createElement("ul");

    notes.forEach(function (note) {
      const li = document.createElement("li");
      li.textContent = note;
      ul.appendChild(li);
    });

    wrapper.appendChild(ul);
    output.appendChild(wrapper);
  }

  /* ===============================
     EVENTS
  =============================== */

  document.getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document.getElementById("startWorkoutBtn")
    .addEventListener("click", function () {
      console.log("Workout started");
    });

});
