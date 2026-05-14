document.addEventListener("DOMContentLoaded", () => {
  const state = {
    goal: "hypertrophy",
    equipment: "fullgym",
    time: 30,
    condMode: "auto",
    cardioPlacement: "end"
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

  /* ---------------- BUTTON GROUPS ---------------- */
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

  /* ---------------- FUNCTIONAL POOLS ---------------- */
  const EXERCISES = {
    fullgym: {
      squat: ["Back Squat", "Goblet Squat"],
      hinge: ["Deadlift", "RDL"],
      push: ["Push‑ups", "Bench Press"],
      pull: ["Row", "Pull‑ups"]
    },
    dumbbells: {
      squat: ["DB Goblet Squat"],
      hinge: ["DB RDL"],
      push: ["DB Push‑ups"],
      pull: ["DB Row"]
    },
    kettlebell: {
      squat: ["KB Goblet Squat"],
      hinge: ["KB Swing"],
      push: ["KB Push Press"],
      pull: ["KB Row"]
    },
    sandbag: {
      squat: ["Sandbag Squat"],
      hinge: ["Sandbag Deadlift"],
      push: ["Sandbag Push Press"],
      pull: ["Sandbag Row"]
    }
  };

  const CARDIO = {
    fullgym: ["Assault Bike", "Row Erg", "Sled Push / Drag", "Incline Walk"],
    dumbbells: ["Farmer Carry March", "DB Step‑ups"],
    kettlebell: ["KB Carry March", "KB Swing"],
    sandbag: ["Sandbag Carry", "Sandbag March"]
  };

  const COACHING = {
    conditioning: [
      "Pace should be repeatable",
      "Breathe early, don’t panic",
      "Finish feeling worked, not wrecked"
    ]
  };

  function loadProg() {
    return JSON.parse(localStorage.getItem("progression")) || { rounds: 3 };
  }

  /* ---------------- GENERATE ---------------- */
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

  /* ---------------- RENDER ---------------- */
  function renderStep() {
    workoutCard.className =
      "workout-card " + (state.goal === "conditioning" ? "mode-conditioning" : "");

    if (stepIndex >= workout.length) {
      workoutCard.innerHTML = `
        <div class="session-complete">
          <h1>SESSION COMPLETE</h1>
          <p>Nice work. Recover well.</p>
        </div>
      `;
      return;
    }

    const step = workout[stepIndex];

    /* Warm‑up checklist */
    if (step.type === "warmup") {
      workoutCard.innerHTML = `
        <h2>Warm‑up</h2>
        <ul class="warmup-list">
          ${step.items.map(i => `<li>${i}</li>`).join("")}
        </ul>
        <button class="big-action" id="next">Begin</button>
      `;
      workoutCard.querySelectorAll("li").forEach(li =>
        li.onclick = () => li.classList.toggle("done")
      );
      document.getElementById("next").onclick = () => {
        stepIndex++;
        renderStep();
      };
      return;
    }

    /* Conditioning block with exercises */
    if (step.type === "conditioning") {
      const ex = step.exercises[exerciseIndex];

      workoutCard.innerHTML = `
        <h2>${step.title}</h2>
        <div class="current-exercise">${ex}</div>
        <p>${step.detail}</p>
        <ul>${step.cues.map(c => `<li>${c}</li>`).join("")}</ul>
        <button class="big-action" id="done">Done</button>
      `;

      document.getElementById("done").onclick = () => {
        exerciseIndex++;
        if (exerciseIndex >= step.exercises.length) {
          stepIndex++;
          exerciseIndex = 0;
        }
        renderStep();
      };
      return;
    }

    /* Cool‑down */
    workoutCard.innerHTML = `
      <h2>${step.title}</h2>
      <p>${step.detail}</p>
      <button class="big-action" id="next">Finish</button>
    `;
    document.getElementById("next").onclick = () => {
      stepIndex++;
      renderStep();
    };
  }

  /* ---------------- BUILD WORKOUT ---------------- */
  function buildWorkout() {
    const out = [];
    const pool = EXERCISES[state.equipment];
    const cardioPool = CARDIO[state.equipment] || CARDIO.fullgym;
    const patterns = ["squat", "hinge", "push", "pull"];
    const prog = loadProg();

    /* Warm‑up */
    out.push({
      label: "Warm‑up",
      type: "warmup",
      items: [
        "2–3 mins pulse raise",
        "Shoulder & hip mobility",
        "Cat–cow",
        "World’s greatest stretch",
        "90–90 hips",
        "Ankle rocks",
        "Ramp‑up sets of first movement"
      ]
    });

    /* Conditioning day */
    if (state.goal === "conditioning") {
      let exercises;

      if (["zone2", "auto"].includes(state.condMode)) {
        exercises = [cardioPool[Math.floor(Math.random() * cardioPool.length)]];
      } else {
        exercises = patterns
          .slice(0, 2)
          .map(p => pool[p][Math.floor(Math.random() * pool[p].length)]);
      }

      out.push({
        label: "Conditioning",
        type: "conditioning",
        title: state.condMode.toUpperCase(),
        exercises,
        detail: `${state.condMode.toUpperCase()} • ${state.time} minutes`,
        cues: COACHING.conditioning
      });
    }

    /* Cool‑down */
    out.push({
      label: "Cool‑down",
      title: "Cool‑down",
      detail: "Easy walk + breathing"
    });

    return out;
  }
});
``
