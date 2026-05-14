document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     CONTROL STATE
  ===================== */
  const controlState = {
    goal: "strength",
    equipment: "gym",
    duration: 45,
    effort: "moderate",
    conditioning: "easy",
    placement: "after"
  };

  const EXERCISE_POOLS = {
    gym: {
      squat: ["Back Squat", "Front Squat"],
      hinge: ["Deadlift", "Romanian Deadlift"],
      push: ["Bench Press", "Overhead Press"],
      pull: ["Barbell Row", "Pull‑ups"]
    },
    minimal: {
      squat: ["Goblet Squat", "Split Squat"],
      hinge: ["Kettlebell Deadlift", "Hip Hinge"],
      push: ["Push‑ups", "Floor Press"],
      pull: ["Inverted Row", "Band Row"]
    }
  };

  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const preview = document.getElementById("preview");
  const workout = document.getElementById("workout");
  const card = document.getElementById("card");

  let steps = [];
  let index = 0;
  let weeklyLoad = 0;

  /* =====================
     CONTROL PANEL WIRING
  ===================== */
  document.querySelectorAll(".option-row").forEach(row => {
    const key = row.dataset.key;
    row.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        controlState[key] = btn.dataset.value;
      };
    });
  });

  /* =====================
     HELPERS
  ===================== */
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

  function pickExercise(pattern) {
    const pool = EXERCISE_POOLS[controlState.equipment][pattern];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function coachingNote(pattern, effort) {
    if (effort === "light") {
      return "Move smoothly and leave plenty in reserve.";
    }
    if (effort === "hard") {
      return pattern === "hinge"
        ? "Brace hard and protect your back as effort rises."
        : "Strong focus. Push effort but avoid grinding.";
    }
    return "Productive working set. Control every rep.";
  }

  function conditioningBlock() {
    if (controlState.conditioning === "easy") {
      return {
        type: "zone2",
        title: "Easy aerobic work",
        coach: "Comfortable pace. You should be able to talk."
      };
    }
    if (controlState.conditioning === "structured") {
      return {
        type: "emom",
        title: "Structured intervals",
        coach: "Steady effort. Finish each round composed."
      };
    }
    return {
      type: "amrap",
      title: "Hard finisher",
      coach: "Short, sharp effort. Stop before form fades."
    };
  }

  /* =====================
     GENERATE
  ===================== */
  generateBtn.onclick = () => {
    steps = [];
    preview.innerHTML = "";
    weeklyLoad = 0;

    const rounds = deriveRounds(controlState.duration);
    const reps = repsFor(controlState.goal, controlState.effort);
    const patterns = ["squat", "hinge", "push", "pull"];
    const conditioning = conditioningBlock();

    if (controlState.placement === "before") {
      steps.push({ ...conditioning });
      preview.innerHTML += `<div class="flow-item">${conditioning.title}</div>`;
    }

    for (let r = 1; r <= rounds; r++) {
      patterns.forEach(pattern => {
        const name = pickExercise(pattern);
        steps.push({
          type: "strength",
          name,
          pattern,
          round: r,
          reps,
          coach: coachingNote(pattern, controlState.effort)
        });
        preview.innerHTML += `<div class="flow-item">Round ${r}: ${name}</div>`;
      });
    }

    if (controlState.placement === "after") {
      steps.push({ ...conditioning });
      preview.innerHTML += `<div class="flow-item">${conditioning.title}</div>`;
    }

    startBtn.disabled = false;
  };

  /* =====================
     START WORKOUT
  ===================== */
  startBtn.onclick = () => {
    index = 0;
    workout.classList.remove("hidden");
    render();
  };

  /* =====================
     RENDER
  ===================== */
  function render() {
    card.innerHTML = "";

    if (index >= steps.length) {
      card.innerHTML = `
        <div class="card">
          <h2>Session complete</h2>
          <p class="coach">Weekly load: ${weeklyLoad} kg</p>
          <p class="coach">
            ${weeklyLoad < 6000
              ? "Steady progress. Build again next session."
              : weeklyLoad < 9000
              ? "Good workload. Prioritise recovery."
              : "High load week. Consider holding steady next time."}
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

    if (step.type === "zone2" || step.type === "emom" || step.type === "amrap") {
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
