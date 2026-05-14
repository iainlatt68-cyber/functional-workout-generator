document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js loaded – stable base");

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

  if (!preview || !generateBtn || !startBtn) {
    console.error("❌ Required DOM missing");
    return;
  }

  /* =========================
     FORCE BUTTON SAFETY
  ========================= */
  document.querySelectorAll("button").forEach(b => b.type = "button");

  /* =========================
     BUTTON GROUP HANDLING
  ========================= */
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

  /* =========================
     COACHING CUES
  ========================= */
  const COACHING = {
    strength: [
      "Quality reps beat load",
      "Stop when speed drops",
      "Leave the gym feeling capable"
    ],
    hypertrophy: [
      "Chase tension, not fatigue",
      "Stop 0–2 reps before breakdown",
      "Control the eccentric"
    ],
    hiit: [
      "Fast but repeatable",
      "If round one is best, you went too hard",
      "Finish strong, not smashed"
    ],
    zone2: [
      "This should feel almost too easy",
      "Full sentences",
      "You could repeat this tomorrow"
    ],
    tempo: [
      "Uncomfortable but controlled",
      "All intervals should feel similar",
      "Do not turn this into HIIT"
    ],
    mixed: [
      "Smooth beats fast",
      "Consistency over intensity",
      "Transitions matter"
    ]
  };

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
     STEP RENDER
  ========================= */
  function renderStep() {
    if (!workoutCard) return;

    if (stepIndex >= workout.length) {
      workoutCard.innerHTML = `<h2>Session complete</h2>`;
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
          ? "3–5 sets × 3–5 reps • RPE 7–9"
          : "3–4 sets × 8–12 reps • RPE 7–8",
        cues: COACHING[state.goal]
      });

      out.push({
        label: "Cardio (time + effort)",
        title: "Cardio Finish",
        detail: "8–15 minutes • RPE 5–7 • conversational to short sentences",
        cues: [
          "This supports recovery",
          "Stop before legs feel heavy"
        ]
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

    if (mode === "zone2") {
      return [{
        label: "Conditioning – Zone 2",
        title: "Zone 2 Conditioning",
        detail: `${state.time} minutes • RPE 5 • full sentences`,
        cues: COACHING.zone2
      }];
    }

    if (mode === "hiit") {
      return [{
        label: "Conditioning – HIIT",
        title: "HIIT",
        detail: "30–60s work / 30–60s rest • RPE 8–9",
        cues: COACHING.hiit
      }];
    }

    if (mode === "tempo") {
      return [{
        label: "Conditioning – Tempo",
        title: "Tempo",
        detail: "4–6 min efforts / 1–2 min rest • RPE 7–8",
        cues: COACHING.tempo
      }];
    }

    return [{
      label: "Conditioning – Mixed",
      title: "Mixed Conditioning",
      detail: "Multiple movements • repeatable pace",
      cues: COACHING.mixed
    }];
  }

  function autoCondMode() {
    if (state.time <= 20) return "hiit";
    if (state.time >= 45) return "zone2";
    return "tempo";
  }
});
