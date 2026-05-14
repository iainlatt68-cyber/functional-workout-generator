document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    rounds: 3,
    condMode: "zone2",
    cardioPlacement: "end"
  };

  const EXERCISES = [
    { name:"Back Squat", pattern:"squat", cns:1 },
    { name:"Deadlift", pattern:"hinge", cns:1 },
    { name:"Bench Press", pattern:"push", cns:2 },
    { name:"Barbell Row", pattern:"pull", cns:2 }
  ];

  const CARDIO = {
    zone2: { title:"Zone 2 Conditioning", coach:"Easy pace. You should be able to hold a conversation." },
    emom:  { title:"EMOM 10 min", coach:"Finish early to earn rest." },
    amrap: { title:"AMRAP 12 min", coach:"Smooth pace. Don’t redline early." }
  };

  let steps = [];
  let index = 0;
  let weeklyLoad = 0;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutRoot = document.getElementById("workoutRoot");
  const workoutCard = document.getElementById("workoutCard");

  /* CONTROL BUTTONS */
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

  /* GENERATE */
  generateBtn.onclick = () => {
    steps = buildSteps();
    preview.innerHTML = steps.map(s => `
      <div class="flow-card ${s.pattern || "cardio"}">
        <div class="flow-title">${s.title}</div>
        <div class="flow-sub">${s.subtitle}</div>
      </div>
    `).join("");
    startBtn.disabled = false;
  };

  /* START */
  startBtn.onclick = () => {
    index = 0;
    weeklyLoad = 0;
    workoutRoot.classList.remove("hidden");
    render();
  };

  /* BUILD STEPS */
  function buildSteps() {
    const ordered = [...EXERCISES].sort((a,b) => a.cns - b.cns);
    const out = [];

    ordered.forEach(ex => {
      for (let r=1; r<=state.rounds; r++) {
        out.push({
          type:"strength",
          pattern: ex.pattern,
          title: ex.name,
          round: r,
          reps: state.goal==="strength" ? 5 : 10,
          coach:
            ex.cns === 1
              ? "This comes first while you’re fresh. Take your time."
              : "Controlled reps. Stop before form fades."
        });
      }
    });

    const cardio = {
      type:"cardio",
      pattern:"cardio",
      title: CARDIO[state.condMode].title,
      subtitle:"Finish strong",
      coach: CARDIO[state.condMode].coach
    };

    return state.cardioPlacement === "start"
      ? [cardio, ...out]
      : [...out, cardio];
  }

  /* RENDER */
  function render() {
    workoutCard.innerHTML = "";

    if (index >= steps.length) {
      workoutCard.innerHTML = `
        <div class="card">
          <h2>Session complete</h2>
          <p class="coach-note">Weekly load: ${weeklyLoad} kg</p>
          <p class="coach-note">${
            weeklyLoad < 6000
              ? "You’re building steadily."
              : weeklyLoad < 9000
              ? "Good progression. Recover well."
              : "High load week — consider holding steady next time."
          }</p>
          <button class="big-action" id="finish">Finish</button>
        </div>
      `;
      document.getElementById("finish").onclick = () => {
        workoutRoot.classList.add("hidden");
      };
      return;
    }

    const s = steps[index];

    if (s.type === "strength") {
      workoutCard.innerHTML = `
        <div class="card">
          <div class="round">Round ${s.round} of ${state.rounds}</div>
          <div class="pattern">${s.pattern}</div>
          <h2>${s.title}</h2>
          <p>${s.reps} reps</p>
          <p class="coach-note">${s.coach}</p>
          <input type="number" id="weight" placeholder="Weight used (kg)" />
          <p class="coach-note">If this felt solid, +2.5kg next time.</p>
          <button class="big-action" id="next">Save & Next</button>
        </div>
      `;
      document.getElementById("next").onclick = () => {
        const w = Number(document.getElementById("weight").value) || 0;
        weeklyLoad += w * s.reps;
        index++;
        render();
      };
      return;
    }

    /* CARDIO */
    workoutCard.innerHTML = `
      <div class="card">
        <h2>${s.title}</h2>
        <p class="coach-note">${s.coach}</p>
        <button class="big-action" id="next">Finish</button>
      </div>
    `;
    document.getElementById("next").onclick = () => {
      index++;
      render();
    };
  }

});
