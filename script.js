// =====================
// Exercise Data
// =====================
const EXERCISES = {
  bodyweight: {
    beginner: [
      "Squats",
      "Wall Push-Ups",
      "Glute Bridges",
      "Marching in Place",
      "Plank (knees)"
    ],
    intermediate: [
      "Push-Ups",
      "Lunges",
      "Plank",
      "Mountain Climbers",
      "Jump Squats"
    ],
    advanced: [
      "Pistol Squats",
      "Decline Push-Ups",
      "Burpees",
      "Hollow Hold",
      "Jump Lunges"
    ]
  },
  dumbbells: {
    beginner: [
      "Goblet Squats",
      "Dumbbell Rows",
      "Dumbbell Floor Press",
      "Farmer Carry"
    ],
    intermediate: [
      "Split Squats",
      "Renegade Rows",
      "Dumbbell Thrusters",
      "Single-Arm Press"
    ],
    advanced: [
      "Man Makers",
      "Dumbbell Snatch",
      "Devil Press",
      "Overhead Lunges"
    ]
  },
  bands: {
    beginner: [
      "Band Squats",
      "Band Chest Press",
      "Band Rows",
      "Band Pull-Aparts"
    ],
    intermediate: [
      "Band Deadlifts",
      "Band Overhead Press",
      "Band Face Pulls"
    ],
    advanced: [
      "Explosive Band Squats",
      "Tempo Band Press",
      "Single-Leg Band Deadlift"
    ]
  }
};

// =====================
// Utility Functions
// =====================
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getRepScheme(level) {
  if (level === "beginner") return "8–10 reps";
  if (level === "intermediate") return "10–12 reps";
  return "12–15 reps";
}

function getExerciseCount(duration) {
  if (duration === "10") return 3;
  if (duration === "20") return 4;
  return 5;
}

// =====================
// Workout Generation
// =====================
function generateWorkout() {
  const level = document.getElementById("level").value;
  const duration = document.getElementById("duration").value;
  const equipment = document.getElementById("equipment").value;

  const output = document.getElementById("workoutOutput");
  output.innerHTML = "";

  const exercisePool = EXERCISES[equipment][level];
  const numberOfExercises = getExerciseCount(duration);
  const reps = getRepScheme(level);

  const workout = shuffle([...exercisePool]).slice(0, numberOfExercises);

  workout.forEach(exercise => {
    const card = document.createElement("div");
    card.className = "exercise-card";

    card.innerHTML = `
      <h3>${exercise}</h3>
      <p>${reps}</p>
      <button type="button">Mark complete ✅</button>
    `;

    output.appendChild(card);
  });
}

// =====================
// Timer Logic
// =====================
let timeLeft = 30;
let timerInterval;

function startTimer() {
  clearInterval(timerInterval);

  const
