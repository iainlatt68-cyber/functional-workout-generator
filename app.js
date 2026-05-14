document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     STATE
  ========================= */
  const state = {
    goal: "hypertrophy",
    equipment: "fullgym",
    difficulty: "moderate",
    rounds: 3,
    condMode: "zone2"
  };

  let workout = [];
  let stepIndex = 0;
  let timer = null;
  let timeRemaining = 0;
  let emomMinute = 1;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutScreen = document.getElementById("workoutScreen");
  const workoutCard = document.getElementById("workoutCard");
  const exitBtn = document.getElementById("exit");

  /* =========================
     BUTTON GROUPS
  ========================= */
  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;
    row.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[group] =
          group === "rounds" ? Number(btn.dataset.value) : btn.dataset.value;
      };
    });
  });

  /* =========================
     EXERCISES
  ========================= */
  const EXERCISES = {
    fullgym: {
      strength: [
        "Back Squat",
        "Romanian Deadlift",
        "Bench Press",
        "Pull‑ups"
      ],
      conditioning: [
        "Bike Calories",
        "Row Calories",
        "Wall Balls",
        "Burpees"
      ]
    }
  };

  /* =========================
     GENERATE
  ========================= */
  generateBtn.onclick = () => {
    workout = buildWorkout();
    preview.innerHTML = workout.map(w => `<div>${w.label}</div>`).join("");
    startBtn.disabled = false;
  };

  startBtn.onclick = () => {
    workoutScreen.classList.remove("hidden");
    stepIndex = 0;
    renderStep();
  };

  exitBtn.onclick = () => {
    clearInterval(timer);
    workoutScreen.classList.add("hidden");
  };

  /* =========================
     RENDER
  ========================= */
  function renderStep() {
    clearInterval(timer);

    if (stepIndex >= workout.length) {
      workoutCard.innerHTML = `
        <h1>SESSION COMPLETE</h1>
        <p>Nice work. Recover well.</p>
      `;
      return;
    }

    const step = workout[stepIndex];

    if (step.type === "strength") {
      workoutCard.innerHTML = `
        <h2>${step.label}</h2>
        <p>${step.detail}</p>
        <button class="big-action" id="next">Next</button>
      `;
      document.getElementById("next").onclick = () => {
        stepIndex++;
        renderStep();
      };
      return;
    }

    if (step.type === "zone2") {
      workoutCard.innerHTML = `
        <h2>Zone 2 Conditioning</h2>
        <p>${step.detail}</p>
        <button class="big-action" id="next">Finish</button>
      `;
      document.getElementById("next").onclick = () => {
        stepIndex++;
        renderStep();
      };
      return;
    }

    if (step.type === "emom") {
      startEMOM(step);
      return;
    }

    if (step.type === "amrap") {
      startAMRAP(step);
      return;
    }
  }

  /* =========================
     EMOM
  ========================= */
  function startEMOM(step) {
    emomMinute = 1;
    timeRemaining = 60;

    function tick() {
      workoutCard.innerHTML = `
        <h2>EMOM ${emomMinute}/${step.minutes}</h2>
        <p>${step.exercise}</p>
        <div style="font-size:48px">${timeRemaining}</div>
      `;

      timeRemaining--;

      if (timeRemaining < 0) {
        emomMinute++;
        timeRemaining = 60;
        if (emomMinute > step.minutes) {
          stepIndex++;
          renderStep();
        }
      }
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  /* =========================
     AMRAP
  ========================= */
  function startAMRAP(step) {
    timeRemaining = step.minutes * 60;

    function tick() {
      workoutCard.innerHTML = `
        <h2>AMRAP ${step.minutes} min</h2>
        <p>${step.exercises.join(" • ")}</p>
        <div style="font-size:48px">${timeRemaining}</div>
        <button class="big-action" id="finish">Finish AMRAP</button>
      `;

      document.getElementById("finish").onclick = () => {
        clearInterval(timer);
        stepIndex++;
        renderStep();
      };

      timeRemaining--;
      if (timeRemaining < 0) {
        stepIndex++;
        renderStep();
      }
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  /* =========================
     BUILD WORKOUT
  ========================= */
  function buildWorkout() {
    const out = [];

    for (let r = 1; r <= state.rounds; r++) {
      out.push({
        type: "strength",
        label: `Round ${r}`,
        detail: EXERCISES.fullgym.strength.join(" • ")
      });
    }

    if (state.condMode === "zone2") {
      out.push({
        type: "zone2",
        label: "Zone 2",
        detail: "20–30 min steady conversational pace"
      });
    }

    if (state.condMode === "emom") {
      out.push({
        type: "emom",
        label: "EMOM",
        minutes: 10,
        exercise: "12 Wall Balls"
      });
    }

    if (state.condMode === "amrap") {
      out.push({
        type: "amrap",
        label: "AMRAP",
        minutes: 12,
        exercises: [
          "10 Kettlebell Swings",
          "10 Push‑ups",
          "10 Air Squats"
        ]
      });
    }

    return out;
  }

  /* =========================
     ONBOARDING (SAFE)
  ========================= */
  if (!localStorage.getItem("onboardingSeen")) {
    document.getElementById("onboarding").classList.remove("hidden");
    document.getElementById("onboard-next").onclick = () => {
      document.getElementById("onboarding").classList.add("hidden");
      localStorage.setItem("onboardingSeen", "true");
    };
    document.getElementById("onboard-skip").onclick =
      document.getElementById("onboard-next").onclick;
  }

});
