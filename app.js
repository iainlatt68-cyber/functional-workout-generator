document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    rounds: 3,
    condMode: "zone2"
  };

  const exercises = [
    { name: "Back Squat", pattern: "Squat" },
    { name: "Deadlift", pattern: "Hinge" },
    { name: "Bench Press", pattern: "Push" },
    { name: "Barbell Row", pattern: "Pull" }
  ];

  let steps = [];
  let index = 0;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutRoot = document.getElementById("workoutRoot");
  const workoutCard = document.getElementById("workoutCard");

  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;
    row.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[group] = Number(btn.dataset.value) || btn.dataset.value;
      };
    });
  });

  generateBtn.onclick = () => {
    steps = [];
    exercises.forEach(ex => {
      for (let r = 1; r <= state.rounds; r++) {
        steps.push({
          type: "strength",
          pattern: ex.pattern,
          title: ex.name,
          coach: "This movement is placed here so you can give it full attention."
        });
      }
    });

    preview.innerHTML = steps.map(s => `
      <div class="flow-card">
        <div class="flow-title">${s.title}</div>
        <div class="flow-sub">${s.pattern}</div>
      </div>
    `).join("");

    startBtn.disabled = false;
  };

  startBtn.onclick = () => {
    index = 0;
    workoutRoot.classList.remove("hidden");
    renderStep();
  };

  function renderStep() {
    workoutCard.innerHTML = "";

    if (index >= steps.length) {
      workoutCard.innerHTML = `
        <div class="card">
          <h2>Session complete</h2>
          <p class="coach-note">Enough done for today. Recover well.</p>
          <button class="big-action" id="finish">Exit</button>
        </div>
      `;
      document.getElementById("finish").onclick = () => {
        workoutRoot.classList.add("hidden");
      };
      return;
    }

    const s = steps[index];

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="pattern">${s.pattern}</div>
      <h2>${s.title}</h2>
      <p class="coach-note">${s.coach}</p>
      <button class="big-action">Next</button>
    `;

    card.querySelector("button").onclick = () => {
      index++;
      renderStep();
    };

    workoutCard.appendChild(card);
  }

});
