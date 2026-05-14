document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js loaded – restored + progression");

  /* =========================
     STATE
  ========================= */
  const state = {
    goal: "hypertrophy",
    difficulty: "intermediate",
    equipment: "fullgym",
    time: 30,
    condMode: "auto"
  };

  let workout = [];
  let stepIndex = 0;

  /* =========================
     DOM (GUARDED)
  ========================= */
  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutScreen = document.getElementById("workoutScreen");
  const workoutCard = document.getElementById("workoutCard");
  const exitBtn = document.getElementById("exit");
  const feedbackBox = document.getElementById("feedback");

  if (!preview || !generateBtn || !startBtn) {
    console.error("❌ Required DOM missing");
    return;
  }

  /* =========================
     BUTTON SAFETY
  ========================= */
  document.querySelectorAll("button").forEach(b => b.type = "button");

  /* =========================
     BUTTON GROUPS
  ========================= */
  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;
    row.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[group] = group === "time"
          ? Number(btn.dataset.value)
          : btn.dataset.value;
      });
    });
  });

  /* =========================
     COACHING CUES
  ========================= */
  const CUES = {
    strength: ["Quality reps beat load", "Stop when speed drops"],
    hypertrophy: ["Chase tension, not fatigue", "Stop 0–2 reps before breakdown"],
    hiit: ["Fast but repeatable", "Finish strong, not smashed"],
    zone2: ["Full sentences", "This should feel almost too easy"],
    tempo: ["Uncomfortable but controlled", "All intervals should feel similar"],
    mixed: ["Smooth beats fast", "Consistency over intensity"]
  };

  /* =========================
     AUTO‑PROGRESSION MEMORY
  ========================= */
  function getProgressionKey() {
    return `progress_${state.goal}_${state.condMode}`;
  }

  function loadProgression() {
    return JSON.parse(localStorage.getItem(getProgressionKey())) || {};
  }

  function saveProgression(data) {
    localStorage.setItem(getProgressionKey(), JSON.stringify(data));
  }

  function applyProgression(base) {
    const p = loadProgression();
    return { ...base, ...p };
  }

  /* =========================
     GENERATE
  ========================= */
  generateBtn.addEventListener("click", () => {
    workout = buildWorkout();
    stepIndex = 0;
    preview.innerHTML = workout.map(w => `<div>${w.label}</div>`).join("");
    startBtn.disabled = false;
  });

  /* =========================
     START / EXIT
  ========================= */
  startBtn.addEventListener("click", () => {
    if (workoutScreen) workoutScreen.classList.remove("hidden");
    stepIndex = 0;
    renderStep();
  });

  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      if (workoutScreen) workoutScreen.classList.add("hidden");
      workoutCard.innerHTML = "";
    });
  }

  /* =========================
     STEP FLOW
  ========================= */
  function renderStep() {
    if (!workoutCard) return;

    if (stepIndex >= workout.length) {
      workoutCard.innerHTML = `
        <h2>Session complete</h2>
        <p>How did that feel?</p>
        <button data-fb="easy">Too easy</button>
        <button data-fb="ok">About right</button>
        <button data-fb="hard">Too hard</button>
      `;

      workoutCard.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => handleFeedback(btn.dataset.fb));
      });
      return;
    }

    const step = workout[stepIndex];
    workoutCard.innerHTML = `
      <h2>${step.title}</h2>
      <p>${step.detail}</p>
      ${step.cues ? `<ul>${step.cues.map(c => `<li>${c}</li>`).join("")}</ul>` : ""}
      <button id="nextBtn">Next</button>
    `;

    document.getElementById("nextBtn").onclick = () => {
      stepIndex++;
      renderStep();
    };
  }

  /* =========================
     FEEDBACK → PROGRESSION
  ========================= */
  function handleFeedback(feedback) {
    const p = loadProgression();

    if (state.goal !== "conditioning") {
      if (feedback === "easy") p.cardioMins = (p.cardioMins || 10) + 5;
      if (feedback === "hard") p.cardioMins = Math.max(5, (p.cardioMins || 10) - 5);
    } else {
      if (feedback === "easy") p.rounds = (p.rounds || 6) + 1;
      if (feedback === "hard") p.rounds = Math.max(4, (p.rounds || 6) - 1);
    }

    saveProgression(p);
    if (workoutScreen) workoutScreen.classList.add("hidden");
  }

  /* =========================
     WORKOUT BUILDERS
  ========================= */
  function buildWorkout() {
    const out = [];

    out.push({
      label: "Warm‑up",
      title: "Warm‑up",
      detail: "Joint circles, cat‑cow, lunges, arm swings"
    });

    if (state.goal === "conditioning") {
      out.push(...buildConditioning());
    }

    if (state.goal === "strength" || state.goal === "hypertrophy") {
      out.push({
        label: "Main work",
        title: "Main lifts",
        detail: state.goal === "strength"
          ? "3–5 × 3–5 @ RPE 7–9"
          : "3–4 × 8–12 @ RPE 7–8",
        cues: CUES[state.goal]
      });

      const prog = applyProgression({ cardioMins: 10 });

      out.push({
        label: "Cardio",
        title: "Cardio Finish",
        detail: `${prog.cardioMins} minutes • RPE 5–7`,
        cues: ["Supports recovery", "Stop before legs feel heavy"]
      });
    }

    out.push({
      label: "Cool‑down",
      title: "Cool‑down",
      detail: "Easy walk + stretching + breathing"
    });

    return out;
  }

  function buildConditioning() {
    const mode = state.condMode === "auto" ? autoCondMode() : state.condMode;
    const prog = applyProgression({ rounds: 6 });

    if (mode === "zone2") {
      return [{
        label: "Conditioning – Zone 2",
        title: "Zone 2",
        detail: `${state.time + (prog.extraMins || 0)} minutes • RPE 5`,
        cues: CUES.zone2
      }];
    }

    return [{
      label: `Conditioning – ${mode.toUpperCase()}`,
      title: mode.toUpperCase(),
      detail: `${prog.rounds} rounds • repeatable pace`,
      cues: CUES[mode]
    }];
  }

  function autoCondMode() {
    if (state.time <= 20) return "hiit";
    if (state.time >= 45) return "zone2";
    return "tempo";
  }
});
