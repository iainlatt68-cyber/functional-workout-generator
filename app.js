document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js running");

  const state = {
    goal: "hypertrophy",
    time: 30,
    condMode: "auto"
  };

  let workout = [];
  let stepIndex = 0;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutScreen = document.getElementById("workoutScreen");
  const workoutCard = document.getElementById("workoutCard");
  const exitBtn = document.getElementById("exit");

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

  const EXERCISES = {
    squat: ["Back Squat", "Goblet Squat"],
    hinge: ["Deadlift", "RDL"],
    push: ["Bench Press", "Overhead Press"],
    pull: ["Row", "Pull‑ups"],
    carry: ["Farmer Carry"]
  };

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
  });

  function renderStep() {
    if (stepIndex >= workout.length) {
      workoutCard.innerHTML = `<h2>Session complete</h2>`;
      return;
    }

    const step = workout[stepIndex];
    workoutCard.innerHTML = `
      <h2>${step.title}</h2>
      <p>${step.detail}</p>
      <button id="nextBtn">Next</button>
    `;

    document.getElementById("nextBtn").onclick = () => {
      stepIndex++;
      renderStep();
    };
  }

  function buildWorkout() {
    const out = [];

    out.push({
      label: "Warm‑up",
      title: "Warm‑up",
      detail: "Joint circles, cat‑cow, lunges, arm swings"
    });

    if (state.goal === "conditioning") {
      out.push({
        label: "Conditioning",
        title: "Conditioning",
        detail: conditioningDetail()
      });
    } else {
      Object.keys(EXERCISES).slice(0, 4).forEach(pattern => {
        const ex = EXERCISES[pattern][0];
        out.push({
          label: ex,
          title: ex,
          detail:
            state.goal === "strength"
              ? "3–5 × 3–5 reps"
              : "3–4 × 8–12 reps"
        });
      });

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

  function conditioningDetail() {
    if (state.condMode === "zone2") return `${state.time} mins • RPE 5`;
    if (state.condMode === "hiit") return "30–60s work / rest • RPE 8–9";
    if (state.condMode === "tempo") return "4–6 min intervals • RPE 7–8";
    return "Mixed conditioning • repeatable pace";
  }
});
