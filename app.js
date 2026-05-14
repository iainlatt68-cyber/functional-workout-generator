document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js loaded – click-safe mode");

  /* =====================================================
     HARD SAFETY: MAKE BUTTONS CLICKABLE NO MATTER WHAT
  ===================================================== */

  // 1. Force all buttons to be non-submit buttons
  document.querySelectorAll("button").forEach(btn => {
    btn.type = "button";
  });

  // 2. Ensure hidden workout overlay never intercepts clicks
  const workoutScreen = document.getElementById("workoutScreen");
  if (workoutScreen) {
    workoutScreen.style.pointerEvents = "none";
  }

  /* =====================================================
     STATE
  ===================================================== */
  const state = {
    goal: "hypertrophy",
    difficulty: "intermediate",
    equipment: "fullgym",
    time: 30,
    condMode: "auto"
  };

  let workout = [];
  let stepIndex = 0;

  /* =====================================================
     DOM
  ===================================================== */
  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutCard = document.getElementById("workoutCard");
  const exitBtn = document.getElementById("exit");
  const feedbackBox = document.getElementById("feedback");

  /* =====================================================
     BUTTON GROUP HANDLING (GOAL / TIME / MODE ETC.)
  ===================================================== */
  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;

    row.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        console.log(`✅ ${group} button clicked`, btn.dataset.value);

        row.querySelectorAll("button").forEach(b =>
          b.classList.remove("active")
        );
        btn.classList.add("active");

        const value = btn.dataset.value;
        state[group] = group === "time" ? Number(value) : value;

        console.log("STATE NOW:", { ...state });
      });
    });
  });

  /* =====================================================
     GENERATE WORKOUT
  ===================================================== */
  generateBtn.addEventListener("click", () => {
    console.log("✅ Generate clicked");

    workout = buildWorkout();
    stepIndex = 0;

    preview.innerHTML = workout
      .map(step => `<div>${step.label}</div>`)
      .join("");

    startBtn.disabled = false;

    console.log("✅ Workout generated:", workout);
  });

  /* =====================================================
     START WORKOUT
  ===================================================== */
  startBtn.addEventListener("click", () => {
    console.log("✅ Start workout");

    workoutScreen.classList.remove("hidden");
    workoutScreen.style.pointerEvents = "auto";
    feedbackBox.classList.add("hidden");

    stepIndex = 0;
    renderStep();
  });

  /* =====================================================
     EXIT WORKOUT
  ===================================================== */
  exitBtn.addEventListener("click", () => {
    console.log("✅ Exit workout");

    workoutScreen.classList.add("hidden");
    workoutScreen.style.pointerEvents = "none";
    workoutCard.innerHTML = "";
    feedbackBox.classList.add("hidden");
  });

  /* =====================================================
     STEP RENDERING
  ===================================================== */
  function renderStep() {
    if (stepIndex >= workout.length) {
      workoutCard.innerHTML = `<h2>Session complete</h2>`;
      feedbackBox.classList.remove("hidden");
      return;
    }

    const step = workout[stepIndex];

    workoutCard.innerHTML = `
      <h2>${step.title}</h2>
      <p>${step.detail}</p>
      <button id="nextStepBtn">Next</button>
    `;

    document.getElementById("nextStepBtn").addEventListener("click", () => {
      console.log("✅ Next step");
      stepIndex++;
      renderStep();
    });
  }

  /* =====================================================
     WORKOUT LOGIC
  ===================================================== */
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
        detail: "Strength / hypertrophy work (sets & reps)"
      });

      out.push({
        label: "Cardio (time + effort)",
        title: "Cardio Finish",
        detail: "10–15 minutes • RPE 5–7 • conversational to short sentences"
      });
    }

    out.push({
      label: "Cool‑down",
      title: "Cool‑down",
      detail: "Easy walk, stretching, slow breathing"
    });

    return out;
  }

  function buildConditioning() {
    const mode = state.condMode === "auto"
      ? autoCondMode()
      : state.condMode;

    if (mode === "zone2") {
      return [{
        label: "Conditioning – Zone 2",
        title: "Zone 2 Conditioning",
        detail: `${state.time} minutes • RPE 5 • full sentences`
      }];
    }

    if (mode === "hiit") {
      return [{
        label: "Conditioning – HIIT",
        title: "HIIT",
        detail: "30–60s work / 30–60s rest • RPE 8–9"
      }];
    }

    if (mode === "tempo") {
      return [{
        label: "Conditioning – Tempo",
        title: "Tempo",
        detail: "4–6 min efforts / 1–2 min rest • RPE 7–8"
      }];
    }

    return [{
      label: "Conditioning – Mixed",
      title: "Mixed Conditioning",
      detail: "Multiple movements • repeatable pace"
    }];
  }

  function autoCondMode() {
    if (state.time <= 20) return "hiit";
    if (state.time >= 45) return "zone2";
    return "tempo";
  }
});
