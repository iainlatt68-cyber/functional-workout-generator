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
