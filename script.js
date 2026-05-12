console.log("✅ script.js loaded");

const EXERCISES = {
  bodyweight: {
    beginner: ["Squats", "Wall Push-Ups", "Glute Bridges", "Marching in Place"],
    intermediate: ["Push-Ups", "Lunges", "Plank", "Mountain Climbers"],
    advanced: ["Pistol Squats", "Burpees", "Jump Lunges"]
  },
  dumbbells: {
    beginner: ["Goblet Squat", "Dumbbell Row", "Farmer Carry"],
    intermediate: ["Split Squat", "Renegade Row", "Dumbbell Press"],
    advanced: ["Man Makers", "Devil Press", "Dumbbell Snatch"]
  },
  bands: {
    beginner: ["Band Squats", "Band Row", "Band Chest Press"],
    intermediate: ["Band Deadlift", "Band Overhead Press"],
    advanced: ["Explosive Band Squats"]
  }
};

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function repsFor(level) {
  if (level === "beginner") return "8–10 reps";
  if (level === "intermediate") return "10–12 reps";
  return "12–15 reps";
}

function exerciseCount(duration) {
  if (duration === "10") return 3;
  if (duration === "20") return 4;
  return 5;
}

function generateWorkout() {
  const level = document.getElementById("level").value;
  const duration = document.getElementById("duration").value;
  const equipment = document.getElementById("equipment").value;
  const output = document.getElementById("workoutOutput");

  output.innerHTML = "";

  const pool = EXERCISES[equipment][level];
  const workout = shuffle([...pool]).slice(0, exerciseCount(duration));
  const reps = repsFor(level);

  workout.forEach(exercise => {
    const card = document.createElement("div");
    card.className = "exercise-card";

    card.innerHTML = `
      <h3>${exercise}</h3>
      <p>${reps}</p>
      <button type="button">Mark complete ✅</button>
    `;

    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      card.classList.toggle("completed");
      btn.textContent = card.classList.contains("completed")
        ? "Completed ✅"
        : "Mark complete ✅";
    });

    output.appendChild(card);
  });
}

let timerInterval;
let timeLeft;

function startTimer() {
  clearInterval(timerInterval);

  const duration = document.getElementById("duration").value;
  const timer = document.getElementById("timer");

  timeLeft = duration === "10" ? 30 : duration === "20" ? 45 : 60;
  timer.textContent = `${timeLeft} seconds`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timer.textContent = `${timeLeft} seconds`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timer.textContent = "Rest complete ✅";
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateWorkoutBtn")
    .addEventListener("click", generateWorkout);

  document.getElementById("startTimerBtn")
    .addEventListener("click", startTimer);
});
