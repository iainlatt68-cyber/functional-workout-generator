alert("JS LOADED");

document.addEventListener("DOMContentLoaded", function () {
  alert("DOM READY");

  document.getElementById("generateWorkoutBtn").onclick = function () {
    alert("Generate clicked");
  };

  document.getElementById("startWorkoutBtn").onclick = function () {
    alert("Start clicked");
  };
});
