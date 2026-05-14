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

  /* ---------------- FUNCTIONAL EXERCISES ---------------- */
  const EXERCISES = {
    fullgym: {
      squat: ["Back Squat","Front Squat","Goblet Squat"],
      hinge: ["Deadlift","RDL"],
      push: ["Bench Press","Overhead Press","Push-ups"],
      pull: ["Row","Pull-ups","Lat Pulldown"]
    },
    dumbbells: {
      squat: ["DB Goblet Squat"],
      hinge: ["DB RDL"],
      push: ["DB Press"],
      pull: ["DB Row"]
    },
    kettlebell: {
      squat: ["KB Goblet Squat"],
      hinge: ["KB Swing"],
      push: ["KB Press"],
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
    fullgym: ["Assault Bike","Row Erg","Sled Push / Drag","Incline Walk"],
    dumbbells: ["Farmer Carry March","DB Step-ups"],
    kettlebell: ["KB Carry March","KB Swing Intervals"],
    sandbag: ["Sandbag Carry","Sandbag March"]
  };

  const COACHING = {
    strength: ["Quality reps over load","Full recovery between sets"],
    hypertrophy: ["Chase tension","Stop 0–2 reps before breakdown"],
    cardio: ["Conversational pace","Supports recovery"],
    conditioning: ["Repeatable pace","Finish strong"]
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

    /* Warm-up checklist */
    if (step.type === "warmup") {
      workoutCard.innerHTML = `
        <h2>Warm‑up</h2>
        <ul class="warmup-list">
          ${step.items.map(i => `<li>${i}</li>`).join("")}
        </ul>
        <button class="big-action" id="next">Begin Session</button>
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

    /* Round */
    if (step.type === "round") {
      const ex = step.exercises[exerciseIndex];
      workoutCard.innerHTML = `
        <div class="round-indicator">ROUND ${step.roundNumber} / ${step.totalRounds}</div>
        <div class="current-exercise">${ex}</div>
        <p>${step.prescription}</p>
        <ul>${step.cues.map(c => `<li>${c}</li>`).join("")}</ul>
        <button class="big-action" id="done">Done</button>
      `;
      document.getElementById("done").onclick = () => {
        exerciseIndex++;
        if (exerciseIndex >= step.exercises.length) {
          exerciseIndex = 0;
          stepIndex++;
        }
        renderStep();
      };
      return;
    }

    /* Simple step */
    workoutCard.innerHTML = `
      <h2>${step.title}</h2>
      <p>${step.detail}</p>
      ${step.cues ? `<ul>${step.cues.map(c => `<li>${c}</li>`).join("")}</ul>` : ""}
      <button class="big-action" id="next">Continue</button>
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
    const prog = loadProg();
    const patterns = ["squat","hinge","push","pull"];

    /* Warm-up */
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
        "Ramp‑up sets of first lift"
      ]
    });

    /* Conditioning day */
    if (state.goal === "conditioning") {
      out.push({
        label: "Conditioning",
        title: "Conditioning",
        detail: `${state.condMode.toUpperCase()} • ${state.time} minutes`,
        cues: COACHING.conditioning
      });
    } else {
      /* Cardio first if selected */
      if (state.cardioPlacement === "start") {
        out.push(buildCardio(cardioPool));
      }

      for (let r = 1; r <= prog.rounds; r++) {
        out.push({
          label: `Round ${r}`,
          type: "round",
          roundNumber: r,
          totalRounds: prog.rounds,
          exercises: patterns.map(p =>
            pool[p][Math.floor(Math.random() * pool[p].length)]
          ),
          prescription:
            state.goal === "strength"
              ? "3–5 reps each • RPE 7–9"
              : "8–12 reps each • RPE 7–8",
          cues: COACHING[state.goal]
        });
      }

      /* Cardio at end */
      if (state.cardioPlacement === "end") {
        out.push(buildCardio(cardioPool));
      }
    }

    out.push({
      label: "Cool‑down",
      title: "Cool‑down",
      detail: "Easy walk + breathing"
    });

    return out;
  }

  function buildCardio(pool) {
    const mins =
      state.time <= 30 ? "8–12 minutes" :
      state.time <= 45 ? "10–15 minutes" :
      "12–20 minutes";

    return {
      label: "Cardio",
      title: "Engine Work",
      detail: `${pool[Math.floor(Math.random() * pool.length)]} — ${mins} • RPE 5–7`,
      cues: COACHING.cardio
    };
  }
});
