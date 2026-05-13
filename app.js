document.addEventListener("DOMContentLoaded", () => {
  alert("✅ JS IS RUNNING");

  const buttons = document.querySelectorAll("button");
  console.log("Buttons found:", buttons.length);

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      alert("✅ BUTTON CLICKED: " + btn.textContent.trim());
    });
  });
});
