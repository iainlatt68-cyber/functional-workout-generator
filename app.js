document.addEventListener("DOMContentLoaded", () => {

  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const preview = document.getElementById("preview");
  const workout = document.getElementById("workout");
  const card = document.getElementById("card");

  const rounds = 3;
  let steps = [];
  let index = 0;
  let weeklyLoad = 0;

  const exercises = [
    { name: "Back Squat", pattern: "Squat", reps: 10 },
    { name: "Deadlift", pattern: "Hinge", reps: 8 },
    { name: "Bench Press", pattern: "Push", reps: 10 },
    { name: "Barbell Row", pattern: "Pull", reps: 10 }
  ];

  generateBtn.onclick = () => {
    steps = [];
    preview.innerHTML = "";

    for (let r = 1; r <= rounds; r++) {
      exercises.forEach(ex => {
        steps.push({ ...ex, round: r });
        preview.innerHTML += `<div>Round ${r}: ${ex.name}</div>`;
      });
    }

    steps.push({ type: "cardio", name: "Zone 2 Conditioning" });

    startBtn.disabled = false;
  };

  startBtn.onclick = () => {
    index = 0;
    weeklyLoad = 0;
    workout.style.display = "block";
    render();
  };

  function render() {
    if (index >= steps.length) {
      card.innerHTML = `
        <h2>Session complete</h2>
        <p>Weekly load: ${weeklyLoad} kg</p>
        <button id="finish">Finish</button>
      `;
      document.getElementById("finish").onclick = () => {
        workout.style.display = "none";
      };
      return;
    }

    const step = steps[index];

    if (step.type === "cardio") {
      card.innerHTML = `
        <h2>${step.name}</h2>
        <p>Easy, steady pace. You should be able to talk.</p>
        <button id="next">Finish cardio</button>
      `;
      document.getElementById("next").onclick = () => {
        index++;
        render();
      };
      return;
    }

    card.innerHTML = `
      <div>
        <div>Round ${step.round} of ${rounds}</div>
        <div>${step.pattern}</div>
        <h2>${step.name}</h2>
        <p>${step.reps} reps</p>
        <input id="weight" type="number" placeholder="Weight used (kg)">
        <p>If this felt good, consider +2.5kg next time.</p>
        <button id="next">Save & Next</button>
      </div>
    `;

    document.getElementById("next").onclick = () => {
      const w = Number(document.getElementById("weight").value) || 0;
      weeklyLoad += w * step.reps;
      index++;
      render();
    };
  }

});
