document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "strength",
    duration: 45,
    effort: "moderate"
  };

  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const preview = document.getElementById("preview");
  const workout = document.getElementById("workout");
  const card = document.getElementById("card");

  /* CONTROL PANEL */
  document.querySelectorAll(".option-row").forEach(row => {
    const key = row.dataset.key;
    row.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[key] = btn.dataset.value;
      });
    });
  });

  /* GENERATE */
  generateBtn.addEventListener("click", () => {
    preview.innerHTML = `
      <div>Focus: ${state.goal}</div>
      <div>Duration: ${state.duration} minutes</div>
      <div>Effort: ${state.effort}</div>
    `;
    startBtn.disabled = false;
  });

  /* START */
  startBtn.addEventListener("click", () => {
    workout.classList.remove("hidden");
    card.innerHTML = `
      <h2>Workout started</h2>
      <p>This is where exercise cards will appear.</p>
      <button id="next">Next</button>
    `;
    document.getElementById("next").onclick = () => {
      workout.classList.add("hidden");
    };
  });

});
