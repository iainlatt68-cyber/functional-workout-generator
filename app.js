document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     CONTROL STATE
  ========================= */
  const controlState = {
    goal: "strength",       // strength | muscle | fitness
    duration: 45,           // 30 | 45 | 60
    effort: "moderate",     // light | moderate | hard
    conditioning: "easy",   // easy | structured | hard
    placement: "after"      // before | after
  };

  /* =========================
     ELEMENTS
  ========================= */
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const preview = document.getElementById("preview");
  const workout = document.getElementById("workout");
  const card = document.getElementById("card");

  let steps = [];
  let index = 0;
  let weeklyLoad = 0;

  /* =========================
     CONTROL PANEL WIRING
  ========================= */
  document.querySelectorAll(".option-row").forEach(row => {
    const key = row.dataset.key;
    row.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        controlState[key] = btn.dataset.value;
      });
    });
  });

  /* =========================
     HELPERS
  ========================= */
  function deriveRounds(duration) {
    if (duration <= 30) return 2;
    if (duration <= 45) return 3;
    return 4;
  }

  function repsFor(goal, effort) {
    if (goal === "strength") {
      return effort === "light" ? 3 : effort === "hard" ? 5 : 4;
    }
    return effort === "light" ? 8 : effort === "hard" ? 12 : 10;
  }

  function conditioningBlock(type) {
    if (type === "easy") {
      return {
        title: "Easy aerobic work",
        coach: "Comfortable pace. You should be able to talk."
      };
    }
    if (type === "structured") {
      return {
        title: "Structured intervals",
        coach: "Consistent effort. Finish each round ready for the next."
      };
    }
    return {
      title: "Hard finisher",
      coach: "Short and sharp. Stop before form drops."
    };
  }

  /* =========================
     GENERATE
  ========================= */
  generateBtn.addEventListener("click", () => {
    steps = [];
    preview.innerHTML = "";
    weeklyLoad = 0;

    const rounds = deriveRounds(controlState.duration);
    const reps = repsFor(controlState.goal, controlState.effort);

    const lifts = [
      { name:"Back Squat", pattern:"Squat" },
      { name:"Deadlift", pattern:"Hinge" },
      { name:"Bench Press", pattern:"Push" },
      { name:"Barbell Row", pattern:"Pull" }
    ];

    const conditioning = conditioningBlock(controlState.conditioning);

    if (controlState.placement === "before") {
      steps.push({ type:"cardio", ...conditioning });
      preview.innerHTML += `<div class="flow-item">${conditioning.title}</div>`;
    }

    for (let r = 1; r <= rounds; r++) {
      lifts.forEach(lift => {
        steps.push({
          type:"strength",
          name: lift.name,
          pattern: lift.pattern,
          round: r,
          reps,
          coach:
            controlState.effort === "light"
              ? "Move smoothly. Leave plenty in reserve."
              : controlState.effort === "hard"
              ? "Strong focus. Push effort but keep technique clean."
              : "Productive working set. Control every rep."
        });
        preview.innerHTML += `<div class="flow-item">Round ${r}: ${lift.name}</div>`;
      });
    }

    if (controlState.placement === "after") {
      steps.push({ type:"cardio", ...conditioning });
      preview.innerHTML += `<div class="flow-item">${conditioning.title}</div>`;
    }

    startBtn.disabled = false;
  });

  /* =========================
     START WORKOUT
  ========================= */
  startBtn.addEventListener("click", () => {
    index = 0;
    workout.classList.remove("hidden");
    render();
  });

  /* =========================
     RENDER
  ========================= */
  function render() {
    card.innerHTML = "";

    if (index >= steps.length) {
      card.innerHTML = `
        <div class="card">
          <h2>Session complete</h2>
          <p class="coach">Weekly load: ${weeklyLoad} kg</p>
          <p class="coach">
            ${weeklyLoad < 6000
              ? "You’re building steadily."
              : weeklyLoad < 9000
              ? "Good progression. Recover well."
              : "High load week — consider holding steady next time."}
          </p>
          <button class="big-action primary" id="finish">Finish</button>
        </div>
      `;
      document.getElementById("finish").onclick = () => {
        workout.classList.add("hidden");
      };
      return;
    }

    const step = steps[index];

    if (step.type === "cardio") {
      card.innerHTML = `
        <div class="card">
          <h2>${step.title}</h2>
          <p class="coach">${step.coach}</p>
          <button class="big-action primary" id="next">Finish</button>
        </div>
      `;
      document.getElementById("next").onclick = () => {
        index++;
        render();
      };
      return;
    }

    card.innerHTML = `
      <div class="card">
        <div class="round">Round ${step.round}</div>
        <div class="pattern">${step.pattern}</div>
        <h2>${step.name}</h2>
        <p>${step.reps} reps</p>
        <p class="coach">${step.coach}</p>
        <input type="number" id="weight" placeholder="Weight used (kg)">
        <p class="coach">If this felt smooth, consider +2.5kg next time.</p>
        <button class="big-action primary" id="next">Save & Next</button>
      </div>
    `;

    document.getElementById("next").onclick = () => {
      const w = Number(document.getElementById("weight").value) || 0;
      weeklyLoad += w * step.reps;
      index++;
      render();
    };
  }

});
