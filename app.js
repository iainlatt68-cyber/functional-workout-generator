document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js loaded – no rest timers");

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

  const EXERCISES = {
    fullgym: ["Back Squat", "Deadlift", "Bench Press", "Row"],
    dumbbells: ["DB Goblet Squat", "DB RDL", "DB Press", "DB Row"],
    kettlebell: ["KB Goblet Squat", "KB Swing", "KB Press", "KB Row"],
    sandbag: ["Sandbag Squat", "Sandbag Deadlift", "Sandbag Press", "Sandbag Row"]
  };

  function loadProgression() {
    return JSON.parse(localStorage.getItem("progression")) || { rounds: 3 };
  }

  function saveProgression(p) {
    localStorage.setItem("progression", JSON.stringify(p));
  }

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

    if (step.type === "round") {
      const exercise = step.exercises[exerciseIndex];
      workoutCard.innerHTML = `
        <h2>${step.title}</h2>
        <p>${exercise}</p>
        <p>${step.prescription}</p>
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

  function handleFeedback(feedback) {
    const p = loadProgression();
    if (feedback === "easy") p.rounds++;
    if (feedback === "hard") p.rounds = Math.max(2, p.rounds - 1);
    saveProgression(p);
    workoutScreen.classList.add("hidden");
  }

  function buildWorkout() {
    const out = [];
    const pool = EXERCISES[state.equipment];
    const prog = loadProgression();

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

    if (state.goal === "conditioning") {
      out.push({
        label: state.condMode.toUpperCase(),
        title: state.condMode.toUpperCase(),
        detail: `${state.time} mins • ${state.condMode}`
      });
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
              : "8–12 reps each"
        });
      }

      out.push({
        label: "Cardio",
        title: "Cardio Finish",
        detail: "8–15 minutes • RPE 5–7"
      });
    }

    out.push({
      label: "Cool‑down",
      title: "Cool‑down",
      detail: "Easy walk + stretching"
    });

    return out;
  }
});
