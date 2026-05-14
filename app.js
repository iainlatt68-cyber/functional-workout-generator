document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js loaded – cardio + coaching restored");

  const state = {
    goal: "hypertrophy",
    equipment: "fullgym",
    time: 30,
    condMode: "auto"
  };

  let workout = [];
  let stepIndex = 0;
  let exerciseIndex = 0;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutScreen = document.getElementById("workoutScreen");
  const workoutCard = document.getElementById("workoutCard");
  const exitBtn = document.getElementById("exit");

  /* ------------------------
     BUTTON GROUPS
  ------------------------ */
  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;
    row.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[group] = group === "time" ? Number(btn.dataset.value) : btn.dataset.value;
      };
    });
  });

  /* ------------------------
     EXERCISES (FILTERED)
  ------------------------ */
  const EXERCISES = {
    fullgym: ["Back Squat", "Deadlift", "Bench Press", "Row"],
    dumbbells: ["DB Goblet Squat", "DB RDL", "DB Press", "DB Row"],
    kettlebell: ["KB Goblet Squat", "KB Swing", "KB Press", "KB Row"],
    sandbag: ["Sandbag Squat", "Sandbag Deadlift", "Sandbag Press", "Sandbag Row"]
  };

  /* ------------------------
     COACHING NOTES
  ------------------------ */
  const COACHING = {
    strength: [
      "Quality reps beat load",
      "Stop the set when speed drops",
      "Full recovery between sets"
    ],
    hypertrophy: [
      "Chase tension, not fatigue",
      "Stop 0–2 reps before breakdown",
      "Control the eccentric"
    ],
    cardio: [
      "This supports recovery, not fatigue",
      "Breathing elevated but controlled",
      "You should be able to talk in short sentences"
    ],
    conditioning: [
      "Pace should be repeatable",
      "If round one is your best, you went too hard",
      "Finish strong, not smashed"
    ]
  };

  /* ------------------------
     AUTO‑PROGRESSION
  ------------------------ */
  function loadProgression() {
    return JSON.parse(localStorage.getItem("progression")) || { rounds: 3 };
  }

  function saveProgression(p) {
    localStorage.setItem("progression", JSON.stringify(p));
  }

  /* ------------------------
     GENERATE / START / EXIT
  ------------------------ */
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
  };

  /* ------------------------
     STEP FLOW
  ------------------------ */
  function renderStep() {
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

    /* ---- ROUND WITH INDIVIDUAL EXERCISES ---- */
    if (step.type === "round") {
      const exercise = step.exercises[exerciseIndex];
      workoutCard.innerHTML = `
        <h2>${step.title}</h2>
        <p><strong>${exercise}</strong></p>
        <p>${step.prescription}</p>
        <ul>${step.cues.map(c => `<li>${c}</li>`).join("")}</ul>
        <button id="complete">Complete</button>
      `;
      document.getElementById("complete").onclick = () => {
        exerciseIndex++;
        if (exerciseIndex >= step.exercises.length) {
          exerciseIndex = 0;
          stepIndex++;
        }
        renderStep();
      };
      return;
    }

    /* ---- SIMPLE STEP (WARM‑UP / CARDIO / CONDITIONING / COOL‑DOWN) ---- */
    workoutCard.innerHTML = `
      <h2>${step.title}</h2>
      <p>${step.detail}</p>
      ${step.cues ? `<ul>${step.cues.map(c => `<li>${c}</li>`).join("")}</ul>` : ""}
      <button id="next">Next</button>
    `;
    document.getElementById("next").onclick = () => {
      stepIndex++;
      renderStep();
    };
  }

  /* ------------------------
     FEEDBACK → PROGRESSION
  ------------------------ */
  function handleFeedback(feedback) {
    const p = loadProgression();
    if (feedback === "easy") p.rounds++;
    if (feedback === "hard") p.rounds = Math.max(2, p.rounds - 1);
    saveProgression(p);
    workoutScreen.classList.add("hidden");
  }

  /* ------------------------
     WORKOUT BUILD
  ------------------------ */
  function buildWorkout() {
    const out = [];
    const pool = EXERCISES[state.equipment];
    const prog = loadProgression();

    /* Warm‑up */
    out.push({
      label: "Warm‑up",
      title: "Warm‑up",
      detail: `
• Neck & shoulder rolls
• Arm circles / band pull‑aparts
• Cat–cow
• World’s greatest stretch
• Hip openers / 90–90
• Ankle rocks
• 1–2 light sets of first exercise
`.trim()
    });

    /* Strength / Hypertrophy */
    if (state.goal !== "conditioning") {
      for (let r = 1; r <= prog.rounds; r++) {
        out.push({
          label: `Round ${r}`,
          title: `Round ${r}`,
          type: "round",
          exercises: pool,
          prescription:
            state.goal === "strength"
              ? "3–5 reps each • RPE 7–9"
              : "8–12 reps each • RPE 7–8",
          cues: COACHING[state.goal]
        });
      }

      /* Cardio — TIME + EFFORT RESTORED */
      const cardioMins =
        state.time <= 30 ? "8–12 minutes" :
        state.time <= 45 ? "10–15 minutes" :
        "12–20 minutes";

      out.push({
        label: "Cardio",
        title: "Cardio Finish",
        detail: `${cardioMins} • RPE 5–7 • conversational to short sentences`,
        cues: COACHING.cardio
      });
    }

    /* Conditioning day */
    if (state.goal === "conditioning") {
      out.push({
        label: state.condMode.toUpperCase(),
        title: state.condMode.toUpperCase(),
        detail: `${state.time} minutes • ${state.condMode}`,
        cues: COACHING.conditioning
      });
    }

    /* Cool‑down */
    out.push({
      label: "Cool‑down",
      title: "Cool‑down",
      detail: "Easy walk + stretching + breathing"
    });

    return out;
  }
});
