document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    equipment: "fullgym",
    time: 30,
    condMode: "zone2",
    cardioPlacement: "end"
  };

  let workout = [];
  let stepIndex = 0;
  let exerciseIndex = 0;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutCard = document.getElementById("workoutCard");

  /* ---------------- BUTTON GROUPS (✅ FIXED) ---------------- */
  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;
    row.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        row.querySelectorAll("button").forEach(x =>
          x.classList.remove("active")
        );
        btn.classList.add("active");
        state[group] =
          group === "time" ? Number(btn.dataset.value) : btn.dataset.value;
      };
    });
  });

  /* ---------------- FUNCTIONAL EXERCISES ---------------- */
  const EXERCISES = {
    fullgym: {
      squat: ["Back Squat", "Front Squat", "Goblet Squat"],
      hinge: ["Deadlift", "Romanian Deadlift"],
      push: ["Bench Press", "Overhead Press", "Push-ups"],
      pull: ["Barbell Row", "Pull-ups", "Lat Pulldown"]
    }
  };

  /* ---------------- ZONE 2 OPTIONS ---------------- */
  const ZONE2 = [
    {
      name: "Exercise Bike",
      cue: "Steady cadence. Full sentences possible."
    },
    {
      name: "Rower",
      cue: "18–22 spm. Long relaxed strokes."
    },
    {
      name: "Crosstrainer",
      cue: "Smooth continuous pace. No surging."
    },
    {
      name: "Treadmill Incline Walk",
      cue: "5–10% incline. Brisk walk, not a jog."
    }
  ];

  const COACHING = {
    strength: [
      "Quality reps over load",
      "Rest fully between sets"
    ],
    hypertrophy: [
      "Chase tension",
      "Stop 0–2 reps before form breaks"
    ],
    zone2: [
      "If breathing strains, slow down",
      "This should feel sustainable"
    ]
  };

  /* ---------------- GENERATE ---------------- */
  generateBtn.onclick = () => {
    workout = buildWorkout();
    preview.innerHTML = workout.map(w => `<div>${w.label}</div>`).join("");
    startBtn.disabled = false;
  };

  startBtn.onclick = () => {
    stepIndex = 0;
    exerciseIndex = 0;
    renderStep();
  };

  /* ---------------- RENDER ---------------- */
  function renderStep() {
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

    /* Warm-up */
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

    /* Strength / Hypertrophy Round */
    if (step.type === "round") {
      const exercise = step.exercises[exerciseIndex];
      const pattern = step.patterns[exerciseIndex];

      workoutCard.innerHTML = `
        <span class="pattern-tag pattern-${pattern}">${pattern}</span>
        <div class="current-exercise">${exercise}</div>
        <p>${step.prescription}</p>
        <ul>
          ${(step.cues || []).map(c => `<li>${c}</li>`).join("")}
        </ul>
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

    /* Zone 2 */
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
  }

  /* ---------------- BUILD WORKOUT ---------------- */
  function buildWorkout() {
    const out = [];
    const patterns = ["squat", "hinge", "push", "pull"];

    out.push({
      label: "Warm‑up",
      type: "warmup",
      items: [
        "Pulse raise 2–3 mins",
        "Hip & shoulder mobility",
        "Cat–cow",
        "World’s greatest stretch",
        "Ramp‑up sets of first lift"
      ]
    });

    const rounds = 3;
    for (let r = 1; r <= rounds; r++) {
      out.push({
        label: `Round ${r}`,
        type: "round",
        patterns,
        exercises: patterns.map(p =>
          EXERCISES.fullgym[p][0]
        ),
        prescription:
          state.goal === "strength"
            ? "3–5 reps each • RPE 7–9"
            : "8–12 reps each • RPE 7–8",
        cues: COACHING[state.goal]
      });
    }

    const z = ZONE2[Math.floor(Math.random() * ZONE2.length)];
    out.push({
      label: "Zone 2",
      type: "zone2",
      activity: z.name,
      detail: "20–30 minutes • RPE 4–5",
      cue: z.cue
    });

    return out;
  }
});
