document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    rounds: 3,
    condMode: "zone2",
    cardioPlacement: "end"
  };

  let steps = [];
  let index = 0;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutCard = document.getElementById("workoutCard");
  const workoutScreen = document.getElementById("workoutScreen");
  const exitBtn = document.getElementById("exit");

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

  const EXERCISES = [
    { name:"Back Squat", pattern:"squat", cns:1 },
    { name:"Deadlift", pattern:"hinge", cns:1 },
    { name:"Bench Press", pattern:"push", cns:2 },
    { name:"Barbell Row", pattern:"pull", cns:2 }
  ];

  generateBtn.onclick = () => {
    steps = buildSteps();
    preview.innerHTML = steps.map(s => `
      <div class="flow-card ${s.pattern}">
        <div class="flow-title">${s.title}</div>
        <div class="flow-sub">${s.subtitle}</div>
      </div>
    `).join("");
    startBtn.disabled = false;
  };

  startBtn.onclick = () => {
    workoutScreen.classList.remove("hidden");
    index = 0;
    render();
  };

  exitBtn.onclick = () => {
    workoutScreen.classList.add("hidden");
  };

  function buildSteps() {
    const ordered = [...EXERCISES].sort((a,b) => a.cns - b.cns);
    const out = [];

    ordered.forEach(ex => {
      for (let r = 1; r <= state.rounds; r++) {
        out.push({
          type: "strength",
          pattern: ex.pattern,
          exercise: ex.name,
          title: ex.name,
          subtitle: `Round ${r} of ${state.rounds}`,
          round: r,
          coach:
            ex.cns === 1
              ? "This comes first while you’re fresh. Take your time."
              : "Strong, controlled reps. No rushing."
        });
      }
    });

    const cardio = {
      type: "cardio",
      pattern: "cardio",
      title: "Zone 2 Conditioning",
      subtitle: "Easy, steady effort to finish",
      coach: "You should be able to breathe through your nose."
    };

    return state.cardioPlacement === "start"
      ? [cardio, ...out]
      : [...out, cardio];
  }

  function render() {
    if (index >= steps.length) {
      workoutCard.innerHTML = `
        <div class="card">
          <h2>Session complete</h2>
          <p class="coach-note">You’ve done enough for today.</p>
        </div>`;
      return;
    }

    const s = steps[index];

    workoutCard.innerHTML = `
      <div class="card">
        <div class="round">Round ${s.round || ""}</div>
        <div class="pattern">${s.pattern}</div>
        <h2>${s.exercise || s.title}</h2>
        <p class="coach-note">${s.coach}</p>
        <button class="big-action" id="nextBtn">Next</button>
      </div>
    `;

    document.getElementById("nextBtn").onclick = () => {
      index++;
      render();
    };
  }

  /* ONBOARDING */
  if (!localStorage.getItem("onboardingSeen")) {
    const slides = [
      ["Train with intent","Compound lifts come first while you’re fresh."],
      ["Stay efficient","The session flows to minimise wasted movement."],
      ["Finish well","Conditioning supports recovery, not punishment."]
    ];
    let i = 0;
    const modal = document.getElementById("onboarding");
    modal.classList.remove("hidden");

    document.getElementById("onboard-title").textContent = slides[0][0];
    document.getElementById("onboard-text").textContent = slides[0][1];

    document.getElementById("onboard-next").onclick = () => {
      i++;
      if (i >= slides.length) {
        modal.classList.add("hidden");
        localStorage.setItem("onboardingSeen","true");
      } else {
        document.getElementById("onboard-title").textContent = slides[i][0];
        document.getElementById("onboard-text").textContent = slides[i][1];
      }
    };
  }

});
