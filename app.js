document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js – final functional baseline");

  const state = {
    goal: "hypertrophy",
    difficulty: "intermediate",
    equipment: "fullgym",
    time: 30,
    condMode: "auto"
  };

  let workout = [];
  let stepIndex = 0;
  let exerciseIndex = 0;
  let restTimer = null;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutScreen = document.getElementById("workoutScreen");
  const workoutCard = document.getElementById("workoutCard");
  const exitBtn = document.getElementById("exit");

  document.querySelectorAll("button").forEach(b => b.type = "button");

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

  function loadProg() {
    return JSON.parse(localStorage.getItem("progress")) || { rounds: 3 };
  }
  function saveProg(p) {
    localStorage.setItem("progress", JSON.stringify(p));
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
    clearInterval(restTimer);
  };

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

    if (step.type === "round") {
      const ex = step.exercises[exerciseIndex];
      workoutCard.innerHTML = `
        <h2>${step.title}</h2>
        <p>${ex}</p>
        <p>${step.prescription}</p>
        <button id="done">Complete</button>
        <div id="rest"></div>
      `;
      document.getElementById("done").onclick = () =>
        startRest(step.rest, () => {
          exerciseIndex++;
          if (exerciseIndex >= step.exercises.length) {
            exerciseIndex = 0;
            stepIndex++;
          }
          renderStep();
        });
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

  function startRest(seconds, cb) {
    let r = seconds;
    const el = document.getElementById("rest");
    el.textContent = `Rest ${r}s`;
    restTimer = setInterval(() => {
      r--;
      el.textContent = `Rest ${r}s`;
      if (r <= 0) {
        clearInterval(restTimer);
        cb();
      }
    }, 1000);
  }

  function handleFeedback(fb) {
    const p = loadProg();
    if (fb === "easy") p.rounds++;
    if (fb === "hard") p.rounds = Math.max(2, p.rounds - 1);
    saveProg(p);
    workoutScreen.classList.add("hidden");
  }

  function buildWorkout() {
    const out = [];
    const pool = EXERCISES[state.equipment];
    const prog = loadProg();

    out.push({ label: "Warm‑up", title: "Warm‑up", detail: "Dynamic mobility" });

    if (state.goal === "conditioning") {
      out.push({
        label: state.condMode.toUpperCase(),
        title: state.condMode.toUpperCase(),
        detail: `${state.time} mins`
      });
    } else {
      for (let r = 1; r <= prog.rounds; r++) {
        out.push({
          label: `Round ${r}`,
          title: `Round ${r}`,
          type: "round",
          exercises: pool,
          prescription:
            state.goal === "strength" ? "3–5 reps each" : "8–12 reps each",
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
});
