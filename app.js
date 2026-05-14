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
      btn.onclick = () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[group] = group === "time" ? Number(btn.dataset.value) : btn.dataset.value;
      };
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
        <div class="session-complete">
          <h1>SESSION COMPLETE</h1>
          <p>Nice work. Recover well.</p>
        </div>`;
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
    const kitMap = {
      fullgym: "barbell, machines and cardio equipment",
      dumbbells: "dumbbells only",
      kettlebell: "kettlebells only",
      sandbag: "sandbags and bodyweight"
    };

    return [
      {
        label: "Warm‑up",
        detail: "Pulse raise, mobility and prep work"
      },
      {
        label: "Strength",
        detail: `Balanced squat, hinge, push and pull using ${kitMap[state.equipment]}`
      },
      {
        label: "Zone 2 Conditioning",
        detail: "20–30 mins at conversational pace"
      }
    ];
  }

  /* ONBOARDING */
  const onboardingSteps = [
    {
      title: "How workouts are built",
      text: "Prepare → Train → Build engine → Recover.\n\nThis keeps quality high and fatigue controlled."
    },
    {
      title: "Strength comes first",
      text: "Strength work is done while you’re fresh so technique stays sharp."
    },
    {
      title: "Conditioning has a purpose",
      text: "Zone 2 builds your aerobic base without burning you out."
    },
    {
      title: "Progress over time",
      text: "You should finish sessions feeling worked — not wrecked."
    }
  ];

  function showOnboarding() {
    if (localStorage.getItem("onboardingSeen") === "true") return;

    const modal = document.getElementById("onboarding");
    const title = document.getElementById("onboard-title");
    const text = document.getElementById("onboard-text");
    const nextBtn = document.getElementById("onboard-next");
    const skipBtn = document.getElementById("onboard-skip");

    let index = 0;

    function render() {
      title.textContent = onboardingSteps[index].title;
      text.textContent = onboardingSteps[index].text;
      nextBtn.textContent =
        index === onboardingSteps.length - 1 ? "Start Training" : "Next";
    }

    function close() {
      modal.classList.add("hidden");
      localStorage.setItem("onboardingSeen", "true");
    }

    nextBtn.onclick = () => {
      if (index === onboardingSteps.length - 1) {
        close();
      } else {
        index++;
        render();
      }
    };

    skipBtn.onclick = close;

    modal.classList.remove("hidden");
    render();
  }

  showOnboarding();
});
