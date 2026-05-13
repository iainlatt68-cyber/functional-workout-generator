document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    difficulty: "intermediate",
    equipment: "fullgym",
    time: 30,
    condMode: "auto"
  };

  let workout = [];
  let step = 0;

  const preview = document.getElementById("preview");
  const startBtn = document.getElementById("start");
  const workoutScreen = document.getElementById("workoutScreen");
  const workoutCard = document.getElementById("workoutCard");
  const feedbackBox = document.getElementById("feedback");

  /* ---------------------------
     UI STATE HANDLING
  --------------------------- */
  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;
    row.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[group] = btn.dataset.value;
      });
    });
  });

  /* ---------------------------
     GENERATE
  --------------------------- */
  document.getElementById("generate").onclick = () => {
    workout = buildWorkout();
    preview.innerHTML = workout.map(w => `<div>${w.label}</div>`).join("");
    startBtn.disabled = false;
  };

  startBtn.onclick = () => {
    workoutScreen.classList.remove("hidden");
    step = 0;
    showStep();
  };

  document.getElementById("exit").onclick = () => {
    workoutScreen.classList.add("hidden");
    feedbackBox.classList.add("hidden");
  };

  /* ---------------------------
     STEP FLOW
  --------------------------- */
  function showStep() {
    if (step >= workout.length) {
      workoutCard.innerHTML = `<h2>Session complete</h2>`;
      feedbackBox.classList.remove("hidden");
      return;
    }

    const w = workout[step];
    workoutCard.innerHTML = `
      <h2>${w.title}</h2>
      <p>${w.detail}</p>
      <button onclick="nextStep()">Next</button>
    `;
  }

  window.nextStep = () => {
    step++;
    showStep();
  };

  /* ---------------------------
     FEEDBACK → AUTO PROGRESSION
  --------------------------- */
  document.querySelectorAll("#feedback button").forEach(btn => {
    btn.onclick = () => {
      const fb = btn.dataset.feedback;
      autoProgress(fb);
      feedbackBox.classList.add("hidden");
    };
  });

  function autoProgress(feedback) {
    const key = `progress_${state.goal}_${state.condMode}`;
    let p = JSON.parse(localStorage.getItem(key)) || { time: state.time };

    if (feedback === "easy") p.time += 5;
    if (feedback === "hard") p.time = Math.max(10, p.time - 5);

    localStorage.setItem(key, JSON.stringify(p));
  }

  /* ---------------------------
     WORKOUT LOGIC
  --------------------------- */
  function buildWorkout() {

    const out = [];

    // Warm-up (single page)
    out.push({
      title: "Warm‑up",
      detail: "Joint circles, cat‑cow, lunges, arm swings",
      label: "Warm‑up"
    });

    if (state.goal === "conditioning") {
      out.push(...buildConditioning());
    }

    if (state.goal === "strength" || state.goal === "hypertrophy") {
      out.push({
        title: "Main Lifts",
        detail: "Strength / hypertrophy work (sets & reps)",
        label: "Main work"
      });

      out.push({
        title: "Cardio Finish",
        detail: cardioForStrength(),
        label: "Cardio (time + effort)"
      });
    }

    out.push({
      title: "Cool‑down",
      detail: "Easy walk + stretching + breathing",
      label: "Cool‑down"
    });

    return out;
  }

  /* ---------------------------
     CARDIO FOR STRENGTH DAYS
  --------------------------- */
  function cardioForStrength() {
    return `10–15 mins • RPE 5–7 • conversational to short sentences`;
  }

  /* ---------------------------
     CONDITIONING MODES
  --------------------------- */
  function buildConditioning() {

    const mode = state.condMode === "auto"
      ? autoCondMode()
      : state.condMode;

    if (mode === "zone2") {
      return [{
        title: "Zone 2 Conditioning",
        detail: `${state.time} mins • RPE 5 • full sentences`,
        label: "Zone 2"
      }];
    }

    if (mode === "hiit") {
      return [{
        title: "HIIT",
        detail: "30–60s work / 30–60s rest • RPE 8–9",
        label: "HIIT intervals"
      }];
    }

    if (mode === "tempo") {
      return [{
        title: "Tempo",
        detail: "4–6 min efforts / 1–2 min rest • RPE 7–8",
        label: "Tempo intervals"
      }];
    }

    return [{
      title: "Mixed Conditioning",
      detail: "Multiple movements • repeatable pace",
      label: "Mixed modal"
    }];
  }

  function autoCondMode() {
    if (state.time <= 20) return "hiit";
    if (state.time >= 45) return "zone2";
    return "tempo";
  }

});
