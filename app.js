document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    equipment: "fullgym",
    time: 30,
    cardioPlacement: "end"
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
      btn.addEventListener("click", () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[group] = group === "time" ? Number(btn.dataset.value) : btn.dataset.value;
      });
    });
  });

  /* GENERATE */
  generateBtn.onclick = () => {
    workout = buildWorkout();
    preview.innerHTML = workout.map(w => `<div>${w.label}</div>`).join("");
    startBtn.disabled = false;
  };

  /* START */
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
      <button class="big-action" id="next">Continue</button>
    `;

    document.getElementById("next").onclick = () => {
      stepIndex++;
      renderStep();
    };
  }

  function buildWorkout() {
    const kit = {
      fullgym: "barbell and machines",
      dumbbells: "dumbbells",
      kettlebell: "kettlebells",
      sandbag: "sandbags"
    };

    return [
      { label: "Warm‑up", detail: "Mobility and pulse raise" },
      { label: "Strength", detail: `Squat, hinge, push and pull using ${kit[state.equipment]}` },
      { label: "Zone 2 Conditioning", detail: "20–30 mins conversational pace" }
    ];
  }

  /* ONBOARDING */
  const onboardingSteps = [
    { title: "How workouts are built", text: "Prepare → Train → Build engine → Recover." },
    { title: "Strength first", text: "Strength is trained while fresh for quality." },
    { title: "Conditioning", text: "Zone 2 builds aerobic base safely." },
    { title: "Progress", text: "Finish worked, not wrecked." }
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
