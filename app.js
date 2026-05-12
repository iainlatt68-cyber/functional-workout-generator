document.addEventListener("DOMContentLoaded", function () {

  const EXERCISES = {
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

  const GOALS = {
    strength: "3–6 reps",
    hypertrophy: "8–12 reps",
    conditioning: "12–20 reps",
    recovery: "Easy controlled reps"
  };

  function generateWorkout() {
    const goal = document.getElementById("goal").value;
    const equipment = document.getElementById("equipment").value;
    const rounds = Number(document.getElementById("rounds").value);
    const output = document.getElementById("workoutOutput");

    output.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = `Workout (${goal.toUpperCase()} / ${equipment.toUpperCase()})`;
    output.appendChild(title);

    const exerciseList = EXERCISES[equipment];

    for (let r = 1; r <= rounds; r++) {
      const roundHeader = document.createElement("h4");
      roundHeader.textContent = `Round ${r}`;
      output.appendChild(roundHeader);

      exerciseList.forEach(exercise => {
        const card = document.createElement("div");
        card.className = "exercise-card";

        const name = document.createElement("strong");
        name.textContent = exercise;
        card.appendChild(name);

        const prescription = document.createElement("p");
        prescription.textContent =
          exercise.toLowerCase().includes("carry") || exercise === "Plank"
            ? "30–45 seconds"
            : GOALS[goal];
        card.appendChild(prescription);

        output.appendChild(card);
      });
    }
  }

  function startWorkout() {
    console.log("Workout started");
  }

  document.getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document.getElementById("startWorkoutBtn")
    .addEventListener("click", startWorkout);

});
