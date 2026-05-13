document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    difficulty: "intermediate",
    equipment: "fullgym",
    time: 30
  };

  let steps = [];
  let stepIndex = 0;
  let timer = null;

  const $ = id => document.getElementById(id);

  /* ------------------ BUTTON STATE ------------------ */
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

  /* ------------------ DATA ------------------ */
  const POOLS = {
    fullgym: [
      { name: "Back Squat", type: "lift" },
      { name: "Bench Press", type: "lift" },
      { name: "Row", type: "lift" },
      { name: "Bike / Rower", type: "conditioning" },
      { name: "Sled Push / Incline Walk", type: "conditioning" }
    ],
    kettlebell: [
      { name: "KB Goblet Squat", type: "lift" },
      { name: "KB Swing", type: "conditioning" }
    ],
    dumbbells: [
      { name: "DB Press", type: "lift" },
      { name: "DB Row", type: "lift" }
    ],
    sandbag: [
      { name: "Sandbag Clean", type: "lift" },
      { name: "Sandbag Carry", type: "conditioning" }
    ]
  };

  const CONDITIONING_EFFORT = {
    beginner: "Easy–Moderate • full sentences • RPE 5–6",
    intermediate: "Moderate–Hard • short sentences • RPE 7–8",
    advanced: "Hard • few words • RPE 8–9",
    elite: "Very Hard • few words • RPE 9"
  };

  /* ------------------ STEP BUILDERS ------------------ */
  const coach = (title, bullets) => ({ type: "coach", title, bullets });
  const list = (title, bullets) => ({ type: "list", title, bullets });
  const exercise = (name, prescription, isConditioning = false) =>
    ({ type: "exercise", name, prescription, isConditioning });
  const timerStep = (title, seconds) => ({ type: "timer", title, seconds });
  const finish = () => ({ type: "finish" });

  /* ------------------ GENERATE ------------------ */
  $("generate").onclick = () => {
    steps = [];
    stepIndex = 0;

    const pool = POOLS[state.equipment] || [];
    const lifts = pool.filter(x => x.type === "lift");
    const conditioning = pool.filter(x => x.type === "conditioning");

    // Warm‑up (single page)
    steps.push(list("Warm‑up (3–5 mins)", [
      "Arm circles • hip circles",
      "Cat‑cow x6",
      "World’s greatest stretch x2/side",
      "Light movement build‑up"
    ]));

    // Coach start
    steps.push(coach("Coach Notes (Start)", [
      "Move well first, then add intent.",
      "Stop any set when form degrades."
    ]));

    // Main work
    if (state.goal === "conditioning") {
      const eff = CONDITIONING_EFFORT[state.difficulty];
      const engine = conditioning[Math.floor(Math.random() * conditioning.length)];

      steps.push(coach("Conditioning Focus", [
        eff,
        "Goal: consistent pace across all intervals"
      ]));

      const rounds = state.time <= 30 ? 8 : 12;
      for (let i = 1; i <= rounds; i++) {
        steps.push(timerStep(`WORK ${i}/${rounds}: ${engine.name}`, 60));
        if (i !== rounds) steps.push(timerStep("REST", 30));
      }

    } else {
      lifts.slice(0, 5).forEach(lift => {
        steps.push(exercise(
          lift.name,
          "3–4 sets × 8–12 reps • controlled tempo",
          false
        ));
      });
    }

    // Cool‑down
    steps.push(list("Cool‑down", [
      "Easy walk / bike 3–5 mins",
      "Hamstrings • hips • calves",
      "Long exhales"
    ]));

    // Coach end
    steps.push(coach("Coach Notes (End)", [
      "If it felt easy: progress next time.",
      "If form slipped: hold load and refine technique.",
      "Consistency beats hero sessions."
    ]));

    steps.push(finish());

    $("start").disabled = false;
    renderPreview();
  };

  /* ------------------ PREVIEW ------------------ */
  function renderPreview() {
    $("previewList").innerHTML = "";
    steps.forEach((s, i) => {
      const div = document.createElement("div");
      div.className = "preview-item";
      div.innerHTML = `<div class="name">${i + 1}. ${s.title || s.name}</div>`;
      $("previewList").appendChild(div);
    });
  }

  /* ------------------ WORKOUT FLOW ------------------ */
  $("start").onclick = () => {
    $("workoutScreen").classList.remove("hidden");
    renderStep();
  };

  $("exitWorkout").onclick = () => {
    clearInterval(timer);
    $("workoutScreen").classList.add("hidden");
  };

  $("skipStep").onclick = next;

  function renderStep() {
    clearInterval(timer);
    const step = steps[stepIndex];
    if (!step) return;

    $("progressText").textContent = `${stepIndex + 1} / ${steps.length}`;

    if (step.type === "exercise") {
      $("workoutCard").innerHTML = `
        <div class="card">
          <h3>${step.name}</h3>
          <p class="sub">${step.prescription}</p>
          <div class="hintline">Tap to continue</div>
        </div>`;
      $("workoutCard").onclick = next;
    }

    if (step.type === "timer") {
      let t = step.seconds;
      $("workoutCard").innerHTML = `
        <div class="card">
          <h3>${step.title}</h3>
          <div class="big" id="count">${t}</div>
        </div>`;
      timer = setInterval(() => {
        t--;
        $("count").textContent = t;
        if (t <= 0) next();
      }, 1000);
    }

    if (step.type === "list" || step.type === "coach") {
      $("workoutCard").innerHTML = `
        <div class="card">
          <h3>${step.title}</h3>
          <ul>${step.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
          <div class="hintline">Tap to continue</div>
        </div>`;
      $("workoutCard").onclick = next;
    }

    if (step.type === "finish") {
      $("workoutCard").innerHTML = `<div class="card"><h3>SESSION COMPLETE</h3></div>`;
    }
  }

  function next() {
    stepIndex++;
    renderStep();
  }
});
