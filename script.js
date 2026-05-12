console.log("✅ script.js parsed and executed");

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM ready");

  var btn = document.getElementById("generateWorkoutBtn");

  if (!btn) {
    console.error("❌ generateWorkoutBtn not found");
    return;
  }

  btn.addEventListener("click", function () {
    alert("✅ Button click confirmed");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("generateWorkoutBtn");
  if (!btn) {
    console.error("❌ generateWorkoutBtn not found");
    return;
  }

  btn.addEventListener("click", function () {
    console.log("✅ Generate Workout clicked");
  });
});
function generateWorkout() {
  var output = document.getElementById("workoutOutput");
  output.innerHTML = "";

  var p = document.createElement("p");
  p.textContent = "Workout generation works ✅";
  output.appendChild(p);
}
