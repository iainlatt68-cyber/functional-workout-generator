document.addEventListener("DOMContentLoaded", () => {
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

  /* ---------- OPTIONAL HAPTICS ---------- */
  function haptic(type = "light") {
    if (!("vibrate" in navigator)) return;
    const map = { light: 10, medium: 25 };
    navigator.vibrate(map[type] || 10);
  }

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
    workoutCard.className = "workout-card";
    workoutCard.classList.add(
      state.goal === "conditioning" ? "mode-conditioning" : "mode-strength"
    );

    if (stepIndex >= workout.length) {
      workoutCard.innerHTML = `
        <div class="session-complete">
          <h1>SESSION COMPLETE</h1>
          <p>Nice work. Breathe. Recover.</p>
        </div>
      `;
      haptic("medium");
      return;
    }

    const step = workout[stepIndex];
    const totalRounds = workout.filter(s => s.type === "round").length;
    const currentRound = Math.ceil((stepIndex + 1) / 1);

    if (step.type === "round") {
      const exercise = step.exercises[exerciseIndex];
      workoutCard.innerHTML = `
        <div class="round-indicator">ROUND ${currentRound} / ${totalRounds}</div>

        <div class="current-exercise">${exercise}</div>

        <p>${step.prescription}</p>

        <button class="big-action" id="complete">Done</button>
      `;
      document.getElementById("complete").onclick = () => {
        haptic("light");
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
      <button class="big-action" id="next">Continue</button>
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

    out.push({ label: "Warm‑up", title: "Warm‑up", detail: "Dynamic mobility" });

    if (state.goal !== "conditioning") {
      for (let r = 1; r <= prog.rounds; r++) {
        out.push({
          label: `Round ${r}`,
          type: "round",
          exercises: pool,
          prescription:
            state.goal === "strength"
              ? "3–5 reps each • RPE 7–9"
              : "8–12 reps each • RPE 7–8"
        });
      }

      out.push({
        label: "Cardio",
        title: "Cardio Finish",
        detail: "10–15 minutes • RPE 5–7 • conversational"
      });
    }

    out.push({ label: "Cool‑down", title: "Cool‑down", detail: "Walk + stretch" });
    return out;
  }
});
