alert("✅ script.js is running");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateWorkoutBtn")
    ?.addEventListener("click", () => {
      alert("Generate button clicked");
    });

  document.getElementById("startTimerBtn")
    ?.addEventListener("click", () => {
      alert("Start button clicked");
    });
});
