alert("JS LOADED");
function saveLog(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadLog(key) {
  return JSON.parse(localStorage.getItem(key) || "{}");
}
document.addEventListener("DOMContentLoaded", function () {
  alert("DOM READY");

  document.getElementById("generateWorkoutBtn").onclick = function () {
    alert("Generate clicked");
  };

  document.getElementById("startWorkoutBtn").onclick = function () {
    alert("Start clicked");
  };
});
