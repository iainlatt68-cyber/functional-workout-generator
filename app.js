document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
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

  /* Button groups */
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

  /* Generate */
  generateBtn.onclick = () => {
    workout = buildWorkout();
    preview.innerHTML = workout.map(w => `<div>${w.label}</div>`).join("");

    const context = getWeeklyContext();
    if (context) {
      preview.innerHTML += `<div style="opacity:.7;font-size:13px">${context}</div>`;
    }

    startBtn.disabled = false;
  };

  /* Start */
  startBtn.onclick = () => {
    workoutScreen.classList.remove("hidden");
    stepIndex = 0;
    renderStep();
    saveWeeklyHistory();
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

    if (step.type === "warmup") {
      workoutCard.innerHTML = `
        <h2>Warm‑up</h2>
        <ul class="warmup-list">
          ${step.items.map(i => `<li>${i}</li>`).join("")}
        </ul>
        <button class="big-action" id="next">Begin</button>`;
      workoutCard.querySelectorAll("li").forEach(li =>
        li.onclick = () => li.classList.toggle("done")
      );
      document.getElementById("next").onclick = () => {
        stepIndex++;
        renderStep();
      };
      return;
    }

    workoutCard.innerHTML = `
      <h2>${step.label}</h2>
      <p>${step.detail}</p>
      <button class="big-action" id="next">Continue</button>`;
    document.getElementById("next").onclick = () => {
      stepIndex++;
      renderStep();
    };
  }

  function buildWorkout() {
    return [
      {
        label: "Warm‑up",
        type: "warmup",
        items: [
          "Pulse raise 2–3 mins",
          "Hip & shoulder mobility",
          "Cat–cow",
          "World’s greatest stretch"
        ]
      },
      {
        label: "Strength",
        detail: "Balanced squat, hinge, push and pull work."
      },
      {
        label: "Zone 2 Conditioning",
        detail: "20–30 mins • conversational pace"
      }
    ];
  }

  /* WEEKLY CONTEXT */
  function saveWeeklyHistory() {
    const history = JSON.parse(localStorage.getItem("weeklyHistory")) || [];
    history.push({ date: new Date().toISOString() });
    localStorage.setItem("weeklyHistory", JSON.stringify(history));
  }

  function getWeeklyContext() {
    const history = JSON.parse(localStorage.getItem("weeklyHistory")) || [];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = history.filter(h => new Date(h.date) > weekAgo);
    if (recent.length >= 2) {
      return `This is your ${recent.length + 1}ᵗʰ session this week.`;
    }
    return "";
  }

  /* ONBOARDING (FIXED) */
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
