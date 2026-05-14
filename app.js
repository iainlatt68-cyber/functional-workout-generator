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
    { name:"Back Squat", pattern:"squat", reps:10, coach:"Brace first. Sit smoothly between the hips." },
    { name:"Deadlift", pattern:"hinge", reps:8, coach:"Push the floor away. Stay tight." },
    { name:"Bench Press", pattern:"push", reps:10, coach:"Control the descent. Strong lockout." },
    { name:"Barbell Row", pattern:"pull", reps:10, coach:"Pull elbows back. Pause briefly." }
  ];

  generateBtn.onclick = () => {
    steps = [];
    preview.innerHTML = "";
    weeklyLoad = 0;

    for (let r = 1; r <= rounds; r++) {
      exercises.forEach(ex => {
        steps.push({ ...ex, round: r });
        preview.innerHTML += `
          <div class="flow-item ${ex.pattern}">
            Round ${r}: ${ex.name}
          </div>`;
      });
    }

    steps.push({ type:"cardio" });
    preview.innerHTML += `
      <div class="flow-item cardio">
        Zone 2 conditioning
      </div>`;

    startBtn.disabled = false;
  };

  startBtn.onclick = () => {
    index = 0;
    workout.classList.remove("hidden");
    render();
  };

  function render() {
    if (index >= steps.length) {
      card.innerHTML = `
        <div class="card">
          <h2>Session complete</h2>
          <p class="coach">Weekly load: ${weeklyLoad} kg</p>
          <p class="coach">
            ${weeklyLoad < 6000
              ? "Steady work. Build again next session."
              : "Solid load. Prioritise recovery."}
          </p>
          <button class="btn start" id="finish">Finish</button>
        </div>
      `;
      document.getElementById("finish").onclick = () => {
        workout.classList.add("hidden");
      };
      return;
    }

    const step = steps[index];

    if (step.type === "cardio") {
      card.innerHTML = `
        <div class="card">
          <h2>Zone 2 conditioning</h2>
          <p class="coach">Easy pace. You should be able to talk.</p>
          <button class="btn primary" id="next">Finish</button>
        </div>
      `;
      document.getElementById("next").onclick = () => {
        index++;
        render();
      };
      return;
    }

    card.innerHTML = `
      <div class="card">
        <div class="round">Round ${step.round} of ${rounds}</div>
        <div class="pattern">${step.pattern}</div>
        <h2>${step.name}</h2>
        <p>${step.reps} reps</p>
        <p class="coach">${step.coach}</p>
        <input type="number" id="weight" placeholder="Weight used (kg)">
        <p class="coach">If this felt smooth, consider +2.5kg next time.</p>
        <button class="btn primary" id="next">Save & Next</button>
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
