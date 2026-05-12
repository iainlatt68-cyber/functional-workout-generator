console.log("✅ script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("generateWorkoutBtn")
    .addEventListener("click", () => {
      alert("Generate Workout button works ✅");
    });

  document
    .getElementById("startTimerBtn")
    .addEventListener("click", () => {
      alert("Start Workout button works ✅");
    });
});
``
