document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js loaded – rounds + EMOM/AMRAP");

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
  let exerciseIndex = 0;
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
     EXERCISES BY EQUIPMENT
  ====================== */
  const EXERCISES = {
    fullgym: ["Back Squat", "Deadlift", "Bench Press", "Row"],
    dumbbells: ["DB Goblet Squat", "DB RDL", "DB Press", "DB Row"],
    kettlebell: ["KB Goblet Squat", "KB Swing", "KB Press", "KB Row"],
    sandbag: ["Sandbag Squat", "Sandbag Deadlift", "Sandbag Press", "Sandbag Row"]
  };

  /* ======================
     AUTO‑PROGRESSION (ROUNDS)
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
  generateBtn.onclick = () => {
    workout = buildWorkout();
    stepIndex = 0;
    preview.innerHTML = workout.map(w => `<div>${w.label}</div>`).join("");
    startBtn.disabled = false;
  };

  startBtn.onclick = () => {
    workoutScreen.classList.remove("hidden");
    stepIndex = 0;
    exerciseIndex = 0;
    renderStep();
  };

  exitBtn.onclick = () => {
    workoutScreen.classList.add("hidden");
    workoutCard.innerHTML = "";
    clearInterval(restTimer);
  };

  /* ======================
     STEP FLOW
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

    /* ---------- ROUND WITH EXERCISES ---------- */
    if (step.type === "round") {
      const exercise = step.exercises[exerciseIndex];

      workoutCard.innerHTML = `
        <h2>${step.title}</h2>
        <p>Exercise ${exerciseIndex + 1} of ${step.exercises.length}</p>
        <h3>${exercise}</h3>
        <p>${step.prescription}</p>
        <button id="complete">Complete</button>
        <div id="rest"></div>
      `;

      document.getElementById("complete").onclick = () =>
        startRest(step.rest || 60, () => {
          exerciseIndex++;
          if (exerciseIndex >= step.exercises.length) {
            exerciseIndex = 0;
            stepIndex++;
          }
          renderStep();
        });

      return;
    }

    /* ---------- CONDITIONING BLOCK ---------- */
    if (step.type === "conditioning") {
      workoutCard.innerHTML = `
        <h2>${step.title}</h2>
        <p>${step.detail}</p>
        <button id="done">Done</button>
      `;
      document.getElementById("done").onclick = () => {
        stepIndex++;
        renderStep();
      };
      return;
    }

    /* ---------- SIMPLE STEP ---------- */
    workoutCard.innerHTML = `
      <h2>${step.title}</h2>
      <p>${step.detail}</p>
      <button id="next">Next</button>
    `;
    document.getElementById("next").onclick = () => {
      stepIndex++;
      renderStep();
    };
  }

  function startRest(seconds, callback) {
    let remaining = seconds;
    const restEl = document.getElementById("rest");

    restEl.textContent = `Rest: ${remaining}s`;
    restTimer = setInterval(() => {
      remaining--;
      restEl.textContent = `Rest: ${remaining}s`;
      if (remaining <= 0) {
        clearInterval(restTimer);
        callback();
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

    if (state.goal === "conditioning") {
      out.push(buildConditioningBlock());
    } else {
      for (let r = 1; r <= prog.rounds; r++) {
        out.push({
          label: `Round ${r}`,
          title: `Round ${r}`,
          type: "round",
          exercises: pool,
          prescription:
            state.goal === "strength"
              ? "3–5 reps each"
              : "8–12 reps each",
          rest: state.goal === "strength" ? 120 : 75
        });
      }

      out.push({
        label: "Cardio",
        title: "Cardio Finish",
        detail: "8–15 minutes • RPE 5–7"
      });
    }

    out.push({ label: "Cool‑down", title: "Cool‑down", detail: "Walk + stretch" });
    return out;
  }

  /* ======================
     CONDITIONING: EMOM / AMRAP
  ====================== */
  function buildConditioningBlock() {
