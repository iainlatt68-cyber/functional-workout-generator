console.log("✅ script.js is executing");

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM ready");

  var btn = document.getElementById("generateWorkoutBtn");

  if (!btn) {
    console.error("❌ Button not found");
    return;
  }

  btn.addEventListener("click", function () {
    alert("✅ Button works");
  });
});
