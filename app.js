document.addEventListener("DOMContentLoaded", function () {

  function generateWorkout() {
    const output = document.getElementById("workoutOutput");
    output.innerHTML = "<p>Workout generated ✅</p>";
  }

  const generateBtn = document.getElementById("generateWorkoutBtn");
  generateBtn.addEventListener("click", generateWorkout);

});
``
