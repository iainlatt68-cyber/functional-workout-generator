document.addEventListener("DOMContentLoaded", () => {
  const generate = document.getElementById("generate");
  const start = document.getElementById("start");
  const preview = document.getElementById("preview");
  const workout = document.getElementById("workout");
  const card = document.getElementById("card");

  let index = 0;
  const steps = ["Squat", "Hinge", "Push", "Pull"];

  generate.onclick = () => {
    preview.textContent = "Workout ready: " + steps.join(", ");
    start.disabled = false;
  };

  start.onclick = () => {
    workout.style.display = "block";
    render();
  };

  function render() {
    if (index >= steps.length) {
      card.innerHTML = "<h2>Done</h2>";
      return;
    }

    card.innerHTML = `
      <h2>${steps[index]}</h2>
      <button id="next">Next</button>
    `;

    document.getElementById("next").onclick = () => {
      index++;
      render();
    };
  }
});
``
