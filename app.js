document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    equipment: "fullgym",
    difficulty: "moderate",
    rounds: 3,
    condMode: "zone2"
  };

  let workout = [];
  let stepIndex = 0;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutScreen = document.getElementById("workoutScreen");
  const workoutCard = document.getElementById("workoutCard");
  const exitBtn = document.getElementById("exit");

  /* BUTTON GROUPS */
  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;
    row.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[group] = group === "rounds"
          ? Number(btn.dataset.value)
          : btn.dataset.value;
      };
    });
  });

  /* EXERCISE POOLS */
  const EXERCISES = {
    fullgym: {
      squat: ["Back Squat", "Front Squat"],
      hinge: ["Deadlift", "Romanian Deadlift"],
      push: ["Bench Press", "Overhead Press"],
      pull: ["Barbell Row", "Pull-ups"]
    },
    dumbbells: {
      squat: ["Goblet Squat"],
      hinge: ["Dumbbell Romanian Deadlift"],
      push: ["Dumbbell Press"],
      pull: ["Dumbbell Row"]
    },
    kettlebell: {
      squat: ["Kettlebell Goblet Squat"],
      hinge: ["Kettlebell Swing"],
      push: ["Kettlebell Push Press"],
      pull: ["Kettlebell Row"]
    },
    sandbag: {
      squat: ["Sandbag Squat"],
      hinge: ["Sandbag Deadlift"],
      push: ["Sandbag Push Press"],
      pull: ["Sandbag Row"]
    }
  };

  const ZONE2 = [
    "Bike – steady conversational pace",
    "Row – 18–22 spm, relaxed",
    "Treadmill – incline walk",
    "Cross‑trainer – smooth continuous pace"
  ];

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
    workoutScreen.classList.add("hidden");
  };

  function renderStep() {
    if (stepIndex >= workout.length) {
      workoutCard.innerHTML = `
        <h1>SESSION COMPLETE</h1>
        <p>Nice work. Recover well.</p>`;
      return;
    }

    const step = workout[stepIndex];
    workoutCard.innerHTML = `
      <h2>${step.label}</h2>
      <p>${step.detail}</p>
      <button class="big-action" id="next">Next</button>
    `;
    document.getElementById("next").onclick = () => {
      stepIndex++;
      renderStep();
    };
  }

  function buildWorkout() {
    const pool = EXERCISES[state.equipment];
    const patterns = ["squat","hinge","push","pull"];

    const strengthExercises = patterns.map(p =>
      pool[p][Math.floor(Math.random() * pool[p].length)]
    );

    const out = [
      { label: "Warm‑up", detail: "Pulse raise and mobility" }
    ];

    for (let r = 1; r <= state.rounds; r++) {
      out.push({
        label: `Round ${r}`,
        detail: strengthExercises.join(" • ")
      });
    }

    if (state.condMode === "zone2") {
      out.push({
        label: "Zone 2 Conditioning",
        detail: ZONE2[Math.floor(Math.random() * ZONE2.length)]
      });
    } else {
      out.push({
        label: state.condMode.toUpperCase(),
        detail: "Conditioning block"
      });
    }

    return out;
  }

  /* ONBOARDING – SAFE */
  const onboardingSteps = [
    { title: "How workouts are built", text: "Prepare → Train → Build engine → Recover." },
    { title: "Strength first", text: "Train strength while fresh for quality." },
    { title: "Conditioning", text: "Conditioning supports fitness without burnout." }
  ];

  function showOnboarding() {
    if (localStorage.getItem("onboardingSeen") === "true") return;

    const modal = document.getElementById("onboarding");
    const title = document.getElementById("onboard-title");
    const text = document.getElementById("onboard-text");
    const next = document.getElementById("onboard-next");
    const skip = document.getElementById("onboard-skip");

    let index = 0;

    function render() {
      title.textContent = onboardingSteps[index].title;
      text.textContent = onboardingSteps[index].text;
      next.textContent = index === onboardingSteps.length - 1 ? "Start Training" : "Next";
    }

    function close() {
      modal.classList.add("hidden");
      localStorage.setItem("onboardingSeen", "true");
    }

    next.onclick = () => {
      if (index === onboardingSteps.length - 1) close();
      else { index++; render(); }
    };

    skip.onclick = close;

    modal.classList.remove("hidden");
    render();
  }

  showOnboarding();
});
