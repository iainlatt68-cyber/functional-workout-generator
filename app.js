document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    equipment: "fullgym",
    difficulty: "moderate",
    rounds: 3,
    condMode: "zone2"
  };

  let workout = [];
  let stepIndex = 0;
  let timer = null;
  let timeRemaining = 0;
  let emomMinute = 1;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutScreen = document.getElementById("workoutScreen");
  const workoutCard = document.getElementById("workoutCard");
  const exitBtn = document.getElementById("exit");

  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;
    row.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[group] = group === "rounds" ? Number(btn.dataset.value) : btn.dataset.value;
      };
    });
  });

  const EXERCISES = {
    fullgym: {
      squat: ["Back Squat","Front Squat"],
      hinge: ["Deadlift","Romanian Deadlift"],
      push: ["Bench Press","Overhead Press"],
      pull: ["Barbell Row","Pull‑ups"]
    },
    dumbbells: {
      squat: ["Goblet Squat"],
      hinge: ["DB RDL"],
      push: ["DB Press"],
      pull: ["DB Row"]
    },
    kettlebell: {
      squat: ["KB Goblet Squat"],
      hinge: ["KB Swing"],
      push: ["KB Push Press"],
      pull: ["KB Row"]
    },
    sandbag: {
      squat: ["Sandbag Squat"],
      hinge: ["Sandbag Deadlift"],
      push: ["Sandbag Push Press"],
      pull: ["Sandbag Row"]
    }
  };

  generateBtn.onclick = () => {
    workout = buildWorkout();
    preview.innerHTML = workout.map(w => `<div>${w.label}</div>`).join("");
    startBtn.disabled = false;
  };

  startBtn.onclick = () => {
    workoutScreen.classList.remove("hidden");
    stepIndex = 0;
    renderStep();
  };

  exitBtn.onclick = () => {
    clearInterval(timer);
    workoutScreen.classList.add("hidden");
  };

  function renderStep() {
    clearInterval(timer);

    if (stepIndex >= workout.length) {
      workoutCard.innerHTML = `
        <div class="card">
          <h1>SESSION COMPLETE</h1>
          <p class="coach-note">Consistency beats intensity.</p>
        </div>`;
      return;
    }

    const step = workout[stepIndex];

    if (step.type === "strength") {
      workoutCard.innerHTML = `
        <div class="card">
          <h2>${step.label}</h2>
          <p>${step.detail}</p>
          <p class="coach-note">${step.coach}</p>
          <button class="big-action" id="next">Next</button>
        </div>`;
      document.getElementById("next").onclick = () => {
        stepIndex++;
        renderStep();
      };
      return;
    }

    if (step.type === "zone2") {
      workoutCard.innerHTML = `
        <div class="card">
          <h2>Zone 2 Conditioning</h2>
          <p>${step.detail}</p>
          <p class="coach-note">Nasal breathing, full sentences.</p>
          <button class="big-action" id="next">Finish</button>
        </div>`;
      document.getElementById("next").onclick = () => {
        stepIndex++;
        renderStep();
      };
      return;
    }

    if (step.type === "emom") startEMOM(step);
    if (step.type === "amrap") startAMRAP(step);
  }

  function startEMOM(step) {
    emomMinute = 1;
    timeRemaining = 60;

    function tick() {
      workoutCard.innerHTML = `
        <div class="card">
          <h2>EMOM ${emomMinute}/${step.minutes}</h2>
          <p>${step.exercise}</p>
          <div class="timer">${timeRemaining}</div>
          <p class="coach-note">Finish early to earn rest.</p>
        </div>`;

      timeRemaining--;
      if (timeRemaining < 0) {
        emomMinute++;
        timeRemaining = 60;
        if (emomMinute > step.minutes) {
          clearInterval(timer);
          stepIndex++;
          renderStep();
        }
      }
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  function startAMRAP(step) {
    timeRemaining = step.minutes * 60;

    function tick() {
      workoutCard.innerHTML = `
        <div class="card">
          <h2>AMRAP ${step.minutes} min</h2>
          <p>${step.exercises.join(" • ")}</p>
          <div class="timer">${timeRemaining}</div>
          <p class="coach-note">Avoid redlining early.</p>
          <button class="big-action" id="finish">Finish AMRAP</button>
        </div>`;

      document.getElementById("finish").onclick = () => {
        clearInterval(timer);
        stepIndex++;
        renderStep();
      };

      timeRemaining--;
      if (timeRemaining < 0) {
        clearInterval(timer);
        stepIndex++;
        renderStep();
      }
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  function buildWorkout() {
    const pool = EXERCISES[state.equipment];
    const patterns = ["squat","hinge","push","pull"];
    const strengthMoves = patterns.map(p =>
      pool[p][Math.floor(Math.random()*pool[p].length)]
    );

    const out = [];
    for (let r = 1; r <= state.rounds; r++) {
      out.push({
        type: "strength",
        label: `Round ${r}`,
        detail: strengthMoves.join(" • "),
        coach: "Smooth reps. Leave 1–2 in reserve."
      });
    }

    if (state.condMode === "zone2") {
      out.push({ type:"zone2", detail:"20–30 min steady pace" });
    }

    if (state.condMode === "emom") {
      out.push({
        type:"emom",
        minutes:10,
        exercise:"12 Wall Balls"
      });
    }

    if (state.condMode === "amrap") {
      out.push({
        type:"amrap",
        minutes:12,
        exercises:["10 KB Swings","10 Push‑ups","10 Air Squats"]
      });
    }

    return out;
  }

  /* Onboarding – safe */
  if (!localStorage.getItem("onboardingSeen")) {
    const modal = document.getElementById("onboarding");
    modal.classList.remove("hidden");
    document.getElementById("onboard-next").onclick =
    document.getElementById("onboard-skip").onclick = () => {
      modal.classList.add("hidden");
      localStorage.setItem("onboardingSeen","true");
    };
  }

});
