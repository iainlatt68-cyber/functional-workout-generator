document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js loaded");

  /* ======================
     STATE
  ====================== */
  const state = {
    goal: "hypertrophy",
    equipment: "fullgym",
    time: 30,
    condMode: "auto"
  };

  let workout = [];
  let stepIndex = 0;
  let restTimer = null;

  /* ======================
     DOM
  ====================== */
  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutScreen = document.getElementById("workoutScreen");
  const workoutCard = document.getElementById("workoutCard");
  const exitBtn = document.getElementById("exit");

  document.querySelectorAll("button").forEach(b => b.type = "button");

  /* ======================
     BUTTON GROUPS
  ====================== */
  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;
    row.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[group] = group === "time" ? Number(btn.dataset.value) : btn.dataset.value;
      });
    });
  });

  /* ======================
     EXERCISE POOLS (FILTERABLE)
  ====================== */
  const EXERCISES = {
    fullgym: {
      squat: ["Back Squat"],
      hinge: ["Deadlift"],
      push: ["Bench Press"],
      pull: ["Row"],
      carry: ["Farmer Carry"]
    },
    dumbbells: {
      squat: ["DB Goblet Squat"],
      hinge: ["DB RDL"],
      push: ["DB Press"],
      pull: ["DB Row"],
      carry: ["DB Carry"]
    },
    kettlebell: {
      squat: ["KB Goblet Squat"],
      hinge: ["KB Swing"],
      push: ["KB Press"],
      pull: ["KB Row"],
      carry: ["KB Suitcase Carry"]
    },
    sandbag: {
      squat: ["Sandbag Squat"],
      hinge: ["Sandbag Deadlift"],
      push: ["Sandbag Push Press"],
      pull: ["Sandbag Row"],
      carry: ["Sandbag Carry"]
    }
  };

  /* ======================
     AUTO‑PROGRESSION MEMORY
  ====================== */
  function loadProgression() {
    return JSON.parse(localStorage.getItem("progression")) || { rounds: 3 };
  }

  function saveProgression(p) {
    localStorage.setItem("progression", JSON.stringify(p));
  }

  /* ======================
     GENERATE
  ====================== */
  generateBtn.addEventListener("click", () => {
    workout = buildWorkout();
    stepIndex = 0;
    preview.innerHTML = workout.map(w => `<div>${w.label}</div>`).join("");
    startBtn.disabled = false;
  });

  startBtn.addEventListener("click", () => {
    workoutScreen.classList.remove("hidden");
    stepIndex = 0;
    renderStep();
  });

  exitBtn.addEventListener("click", () => {
    workoutScreen.classList.add("hidden");
    workoutCard.innerHTML = "";
    clearInterval(restTimer);
  });

  /* ======================
     STEP FLOW + REST TIMER
  ====================== */
  function renderStep() {
    clearInterval(restTimer);

    if (stepIndex >= workout.length) {
      workoutCard.innerHTML = `
        <h2>Session complete</h2>
        <p>How did that feel?</p>
        <button data-fb="easy">Too easy</button>
        <button data-fb="ok">About right</button>
        <button data-fb="hard">Too hard</button>
      `;
      workoutCard.querySelectorAll("button").forEach(b =>
        b.onclick = () => handleFeedback(b.dataset.fb)
      );
      return;
    }

    const step = workout[stepIndex];

    workoutCard.innerHTML = `
      <h2>${step.title}</h2>
      <p>${step.detail}</p>
      <button id="complete">Complete</button>
      <div id="rest"></div>
    `;

    document.getElementById("complete").onclick = () => startRest(step.rest || 60);
  }

  function startRest(seconds) {
    let remaining = seconds;
    const restEl = document.getElementById("rest");

    restEl.textContent = `Rest: ${remaining}s`;
    restTimer = setInterval(() => {
      remaining--;
      restEl.textContent = `Rest: ${remaining}s`;
      if (remaining <= 0) {
        clearInterval(restTimer);
        stepIndex++;
        renderStep();
      }
    }, 1000);
  }

  /* ======================
     FEEDBACK → PROGRESSION
  ====================== */
  function handleFeedback(feedback) {
    const p = loadProgression();
    if (feedback === "easy") p.rounds++;
    if (feedback === "hard") p.rounds = Math.max(2, p.rounds - 1);
    saveProgression(p);
    workoutScreen.classList.add("hidden");
  }

  /* ======================
     WORKOUT BUILD
  ====================== */
  function buildWorkout() {
    const out = [];
    const pool = EXERCISES[state.equipment];
    const prog = loadProgression();

    out.push({ label: "Warm‑up", title: "Warm‑up", detail: "Dynamic mobility" });

    if (state.goal !== "conditioning") {
      for (let r = 1; r <= prog.rounds; r++) {
        out.push({
          label: `Round ${r}`,
          title: `Round ${r}`,
          detail: `${pool.squat[0]} → ${pool.hinge[0]} → ${pool.push[0]} → ${pool.pull[0]}`,
          rest: 90
        });
      }

      out.push({
        label: "Cardio",
        title: "Cardio Finish",
        detail: "8–15 minutes • RPE 5–7",
        rest: 0
      });
    } else {
      out.push({
        label: "Conditioning",
        title: "Conditioning",
        detail: `${state.time} mins • ${state.condMode.toUpperCase()}`
      });
    }

    out.push({ label: "Cool‑down", title: "Cool‑down", detail: "Walk + stretch" });

    return out;
  }
});
