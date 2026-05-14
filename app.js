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

  /* ---------------- FUNCTIONAL EXERCISES (FULL NAMES) ---------------- */
  const EXERCISES = {
    fullgym: {
      squat: ["Back Squat", "Front Squat", "Goblet Squat"],
      hinge: ["Deadlift", "Romanian Deadlift", "Hip Thrust"],
      push: ["Bench Press", "Overhead Press", "Push‑ups"],
      pull: ["Barbell Row", "Pull‑ups", "Lat Pulldown"]
    },
    dumbbells: {
      squat: ["Dumbbell Goblet Squat"],
      hinge: ["Dumbbell Romanian Deadlift"],
      push: ["Dumbbell Bench Press", "Dumbbell Shoulder Press"],
      pull: ["Dumbbell Row"]
    },
    kettlebell: {
      squat: ["Kettlebell Goblet Squat"],
      hinge: ["Kettlebell Swing", "Kettlebell Deadlift"],
      push: ["Kettlebell Press"],
      pull: ["Kettlebell Row"]
    },
    sandbag: {
      squat: ["Sandbag Squat"],
      hinge: ["Sandbag Deadlift"],
      push: ["Sandbag Push Press"],
      pull: ["Sandbag Row"]
    }
  };

  /* ---------------- ZONE 2 CARDIO (REAL OPTIONS) ---------------- */
  const ZONE2 = [
    {
      name: "Exercise Bike",
      cue: "Steady cadence, nasal breathing if possible. You should be able to speak in full sentences."
    },
    {
      name: "Rower",
      cue: "Long, relaxed strokes. Rating ~18–22 spm. Breathing controlled."
    },
    {
      name: "Crosstrainer",
      cue: "Smooth continuous effort. No surging. Keep posture tall."
    },
    {
      name: "Treadmill (Incline Walk)",
      cue: "Incline 5–10%. Brisk walk, not a jog. Conversational pace."
    }
  ];

  const COACHING = {
    strength: [
      "Quality reps beat load",
      "Full control on every rep"
    ],
    hypertrophy: [
      "Chase tension, not fatigue",
      "Stop 0–2 reps before form breaks"
    ],
    zone2: [
      "This should feel almost too easy",
      "You could repeat this tomorrow"
    ]
  };

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

    /* Strength / Hypertrophy Round */
    if (step.type === "round") {
      const ex = step.exercises[exerciseIndex];
      const pattern = step.patterns[exerciseIndex];

      workoutCard.innerHTML = `
        <div class="round-indicator">
          ROUND ${step.roundNumber} / ${step.totalRounds}
        </div>

        <div class="pattern-wrapper">
          <span class="pattern-tag pattern-${pattern}">${pattern}</span>
        </div>

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

    /* Zone 2 Cardio */
    if (step.type === "zone2") {
      workoutCard.innerHTML = `
        <h2>Zone 2 Conditioning</h2>
        <div class="current-exercise">${step.activity}</div>
        <p>${step.detail}</p>
        <ul>
          <li>${step.cue}</li>
          ${COACHING.zone2.map(c => `<li>${c}</li>`).join("")}
        </ul>
        <button class="big-action" id="next">Finish</button>
      `;
      document.getElementById("next").onclick = () => {
        stepIndex++;
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
    const patterns = ["squat", "hinge", "push", "pull"];

    /* Warm‑up */
    out.push({
      label: "Warm‑up",
      type: "warmup",
      items: [
        "2–3 mins easy pulse raise",
        "Shoulder & hip mobility",
        "Cat–cow",
        "World’s greatest stretch",
        "90–90 hips",
        "Ankle rocks",
        "Ramp‑up sets of first movement"
      ]
    });

    /* Strength / Hypertrophy */
    if (state.goal !== "conditioning") {
      const rounds = 3;

      for (let r = 1; r <= rounds; r++) {
        out.push({
          label: `Round ${r}`,
          type: "round",
          roundNumber: r,
          totalRounds: rounds,
          patterns,
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

      /* Zone 2 card */
      const zone2 = ZONE2[Math.floor(Math.random() * ZONE2.length)];
      const mins =
        state.time <= 30 ? "15–20 minutes" :
        state.time <= 45 ? "20–30 minutes" :
        "30–45 minutes";

      out.push({
        label: "Zone 2",
        type: "zone2",
        activity: zone2.name,
        cue: zone2.cue,
        detail: `${mins} • RPE 4–5 • full sentences`
      });
    }

    /* Cool‑down */
    out.push({
      label: "Cool‑down",
      title: "Cool‑down",
      detail: "Easy walk and relaxed breathing"
    });

    return out;
  }
});
