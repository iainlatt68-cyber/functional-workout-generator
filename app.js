document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js running");

  /* -----------------------------
     STATE
  ----------------------------- */
  const state = {
    goal: "hypertrophy",
    difficulty: "intermediate",
    equipment: "fullgym",
    time: 30,
    routine: "auto"
  };

  let steps = [];
  let stepIndex = 0;
  let timer = null;

  /* -----------------------------
     DOM
  ----------------------------- */
  const $ = (id) => document.getElementById(id);

  const previewList = $("previewList");
  const meta = $("meta");
  const generateBtn = $("generate");
  const startBtn = $("start");

  const workoutScreen = $("workoutScreen");
  const workoutCard = $("workoutCard");
  const exitWorkoutBtn = $("exitWorkout");
  const skipStepBtn = $("skipStep");

  const progressText = $("progressText");
  const progressFill = $("progressFill");
  const modeText = $("modeText");

  /* -----------------------------
     BUTTON MENUS -> STATE
  ----------------------------- */
  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;

    row.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const value = btn.dataset.value;
        state[group] = (group === "time") ? Number(value) : value;

        console.log("STATE:", { ...state });
      });
    });
  });

  /* -----------------------------
     CONTENT
  ----------------------------- */
  const EXERCISE_COUNT_BY_TIME = { 15: 4, 30: 7, 45: 10, 60: 12, 90: 16 };

  const REST_BY_GOAL = {
    strength: 120,
    hypertrophy: 75,
    conditioning: 25,
    recovery: 35,
    mobility: 15
  };

  const REST_ADJ_BY_DIFFICULTY = {
    beginner: +20,
    intermediate: 0,
    advanced: -10,
    elite: -15
  };

  const POOLS = {
    dumbbells: [
      { name: "DB Goblet Squat", tags: ["squat"] },
      { name: "DB RDL", tags: ["hinge"] },
      { name: "DB Press", tags: ["push"] },
      { name: "DB Row", tags: ["pull"] },
      { name: "Farmer Carry", tags: ["carry"] },
      { name: "DB Split Squat", tags: ["unilateral","squat"] }
    ],
    kettlebell: [
      { name: "KB Swing", tags: ["hinge","conditioning"] },
      { name: "KB Goblet Squat", tags: ["squat"] },
      { name: "KB Clean & Press", tags: ["push"] },
      { name: "KB One‑Arm Row", tags: ["pull"] },
      { name: "Suitcase Carry", tags: ["carry"] }
    ],
    sandbag: [
      { name: "Sandbag Clean", tags: ["hinge"] },
      { name: "Bear Hug Squat", tags: ["squat"] },
      { name: "Sandbag Carry", tags: ["carry"] },
      { name: "Sandbag Reverse Lunge", tags: ["unilateral"] },
      { name: "Sandbag Row", tags: ["pull"] }
    ],
    fullgym: [
      { name: "Back Squat", tags: ["squat"] },
      { name: "Deadlift", tags: ["hinge"] },
      { name: "Bench Press", tags: ["push"] },
      { name: "Row", tags: ["pull"] },
      { name: "Overhead Press", tags: ["push"] },
      { name: "Lat Pulldown / Pull‑ups", tags: ["pull"] },
      { name: "Bike / Rower", tags: ["conditioning"] }
    ]
  };

  const CUES_BY_TAG = {
    squat: [
      "Brace first, then descend under control.",
      "Drive the floor away; knees track over toes."
    ],
    hinge: [
      "Hips back; spine long—don’t round for depth.",
      "Stand tall and squeeze glutes—no hyperextension."
    ],
    push: [
      "Ribs down; shoulder blades set—press smoothly.",
      "Stop when form breaks; control the lowering."
    ],
    pull: [
      "Pull elbow toward hip; don’t yank with biceps.",
      "Pause briefly at the top; slow return."
    ],
    carry: [
      "Tall posture; ribs stacked over pelvis.",
      "Slow steps; stay symmetrical—no leaning."
    ],
    unilateral: [
      "Control the bottom; pelvis level.",
      "Own each side—quality reps > load."
    ],
    conditioning: [
      "Repeatable pace beats one heroic round.",
      "Relax shoulders and jaw; breathe smoothly."
    ]
  };

  const SESSION_COACHING = {
    strength: {
      start: [
        "Quality reps + full recovery.",
        "Stop the set when speed/form drops."
      ],
      end: [
        "If it felt easy: add load next time.",
        "If reps were grinders: keep load, improve form."
      ]
    },
    hypertrophy: {
      start: [
        "Chase tension: controlled reps, full range.",
        "Stop 0–2 reps short of ugly reps."
      ],
      end: [
        "Progress next time: +1 rep per set or +2.5–5% load.",
        "If you faded early: shorten rests slightly next time."
      ]
    },
    conditioning: {
      start: [
        "Start smoother than you think; build speed.",
        "Smooth transitions matter more than max effort."
      ],
      end: [
        "If you blew up: start 10% easier next time.",
        "If you stayed smooth: reduce rest or add 1 block."
      ]
    },
    recovery: {
      start: [
        "Finish feeling better than you started.",
        "Keep it easy; nasal breathing if possible."
      ],
      end: [
        "If still tense: extend warm‑down + breathing.",
        "Repeat 2–4×/week for best effect."
      ]
    },
    mobility: {
      start: [
        "Move slowly into end ranges—no forcing.",
        "Long exhale helps down‑regulate."
      ],
      end: [
        "Retest tight areas—aim for smoother, not extreme range.",
        "Short and frequent beats long and rare."
      ]
    }
  };

  const EFFORT_BY_DIFFICULTY = {
    beginner: [
      "Stay 2–3 reps in reserve (RIR).",
      "Prioritise form and control."
    ],
    intermediate: [
      "Most sets: 1–2 reps in reserve.",
      "One hard set is fine—don’t redline everything."
    ],
    advanced: [
      "Last set can push close to technical failure.",
      "Autoregulate: crisp reps = progress next time."
    ],
    elite: [
      "High intent; manage fatigue—quality stays king.",
      "If output drops: reduce load or extend rest."
    ]
  };

  const MOBILITY_ROUTINES = {
    fullbody: [
      "90/90 breathing (6 breaths)",
      "Cat‑cow (6–8 reps)",
      "Thread‑the‑needle (5/side)",
      "90/90 hip switches (6 reps)",
      "Ankle rocks (10/side)",
      "Wall slides (10 reps)",
      "Child’s pose breathing (6 breaths)"
    ],
    hips: [
      "90/90 hip switches (8 reps)",
      "Hip flexor lunge + reach (45s/side)",
      "Adductor rock‑backs (8/side)",
      "Couch stretch (45–60s/side)",
      "Deep squat hold (45s)"
    ],
    shoulders: [
      "Arm circles (30s each way)",
      "Wall slides (10 reps)",
      "Scap push‑ups (8–10 reps)",
      "Doorway pec stretch (45s/side)",
      "Lat stretch (45s/side)"
    ],
    tspine: [
      "Cat‑cow (6–8 reps)",
      "Open book rotations (6/side)",
      "Thread‑the‑needle (5/side)",
      "Child’s pose breathing (6 breaths)"
    ],
    postrun: [
      "Easy walk (2 mins)",
      "Calf stretch (45s/side)",
      "Hamstring stretch (45s/side)",
      "Hip flexor stretch (60s/side)",
      "Open book (5/side)"
    ]
  };

  /* -----------------------------
     GENERATION HELPERS
  ----------------------------- */
  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function shuffle(arr){
    for (let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function labelEquipment(e){
    if (e === "dumbbells") return "Dumbbells only";
    if (e === "fullgym") return "Full gym";
    if (e === "sandbag") return "Sandbag";
    if (e === "kettlebell") return "Kettlebell";
    return e;
  }

  function labelRoutine(r){
    if (r === "fullbody") return "Full body";
    if (r === "hips") return "Hips";
    if (r === "shoulders") return "Shoulders";
    if (r === "tspine") return "T‑spine";
    if (r === "postrun") return "Post‑run";
    return "Auto";
  }

  function restFor(goal, difficulty){
    const base = REST_BY_GOAL[goal] ?? 60;
    const adj = REST_ADJ_BY_DIFFICULTY[difficulty] ?? 0;
    return clamp(base + adj, 10, 180);
  }

  function prescriptionFor(goal, difficulty){
    const intensity =
      difficulty === "beginner" ? "RPE 6" :
      difficulty === "intermediate" ? "RPE 7" :
      difficulty === "advanced" ? "RPE 8" : "RPE 9";

    if (goal === "strength") return `3–5 sets × 3–5 reps • ${intensity}`;
    if (goal === "hypertrophy") return `3–4 sets × 8–12 reps • ${intensity}`;
    if (goal === "conditioning") return `Work 40s / Rest 20s • repeatable pace`;
    if (goal === "recovery") return `Easy pace • quality reps • breathe`;
    if (goal === "mobility") return `45–60s per move • slow control • breathe`;
    return `Work at ${intensity}`;
  }

  function cuesFor(ex){
    const tags = ex.tags || [];
    const out = [];
    for (const t of tags){
      const pool = CUES_BY_TAG[t];
      if (pool && pool.length) out.push(pool[0]);
      if (out.length >= 2) break;
    }
    return out.length ? Array.from(new Set(out)).slice(0,2) : ["Move with control.", "Stop if form breaks."];
  }

  function pickRoutine(goal, routineChoice, time){
    if (routineChoice && routineChoice !== "auto") return routineChoice;
    if (goal === "mobility") return time >= 45 ? "fullbody" : "hips";
    if (goal === "recovery") return time >= 30 ? "fullbody" : "tspine";
    return "fullbody";
  }

  /* -----------------------------
     STEP BUILDERS
  ----------------------------- */
  function stepBlock(title, subtitle){
    return { type:"block", title, subtitle };
  }

  function stepCoach(title, subtitle, bullets){
    return { type:"coach", title, subtitle, bullets };
  }

  function stepTimer(title, subtitle, seconds, bullets=[]){
    return { type:"timer", title, subtitle, seconds, bullets };
  }

  function stepList(title, subtitle, bullets, doneText="Tap Done to continue"){
    return { type:"list", title, subtitle, bullets, doneText };
  }

  function stepExercise(name, prescription, restSeconds, cues){
    return { type:"exercise", name, prescription, restSeconds, cues };
  }

  function stepRest(seconds){
    return { type:"rest", seconds };
  }

  function stepFinish(){
    return { type:"finish" };
  }

  function buildWarmup(goal, equipment, time){
    // RAMP: Raise / Activate / Mobilise / Potentiate (structure) [1](https://ohanlonperformance.com/ramp-warm-up-guide/)[2](https://www.performancepurpose.ca/article/the-ramp-warm-up-protocol-for-skills-and-sampc)
    const raise = time <= 15 ? 90 : time <= 30 ? 150 : 180;

    const warm = [
      stepBlock("Warm‑up (RAMP)", "Raise • Activate • Mobilise • Potentiate"),
      stepTimer("Raise", "Light movement to warm up", raise, ["Walk/jog/bike easy", "Nose breathing if possible"]),
      stepList("Activate", "Switch muscles on", ["Glute bridge × 10", "Scap push‑ups × 8", "Dead bug × 6/side"]),
      stepList("Mobilise", "Open key joints", ["World’s greatest stretch × 3/side", "Hip circles × 6/side", "T‑spine rotation × 5/side"]),
      stepList("Potentiate", "Prime for the session", goal === "conditioning"
        ? ["3 × 10s faster pace + 20s easy", "2–3 powerful jumps (optional)"]
        : ["2 light sets of first pattern", "3 crisp reps at moderate effort"])
    ];

    if (equipment === "kettlebell"){
      warm.push(stepList("KB Prep", "Hinge + shoulders", ["KB halo × 6/side", "Hip hinge drill × 8", "Light swings × 10"]));
    }
    if (equipment === "sandbag"){
      warm.push(stepList("Sandbag Prep", "Brace + hinge", ["Bear hug hold × 20s", "Hip hinge drill × 8", "Empty clean pattern × 5"]));
    }

    return warm;
  }

  function buildCooldown(time){
    // Cooldown commonly: 5–10 minutes easier movement + static stretches held ~10–30s [3](https://www.healthline.com/health/exercise-fitness/cooldown-exercises)[4](https://www.goodrx.com/well-being/movement-exercise/cool-down-exercises-after-workout)
    const easy = time <= 15 ? 180 : 300;
    const hold = time <= 30 ? "10–30s" : "15–30s";
    return [
      stepBlock("Warm‑down", "Down‑regulate + restore length"),
      stepTimer("Easy movement", "Bring breathing down", easy, ["Walk / easy bike", "Relax shoulders", "Longer exhale than inhale"]),
      stepList("Static stretches", `Hold each for ${hold}`, ["Hip flexor stretch", "Hamstring stretch", "Calf stretch", "Chest/pec stretch", "Lat stretch"]),
      stepTimer("Breathing", "Shift to calm", 90, ["4s in / 6–8s out", "Ribs soften down", "Jaw/shoulders unclench"])
    ];
  }

  function buildMobilitySession(routineKey, time){
    const list = MOBILITY_ROUTINES[routineKey] || MOBILITY_ROUTINES.fullbody;
    const cap = time <= 15 ? 6 : time <= 30 ? 8 : time <= 45 ? 10 : list.length;
    const chosen = list.slice(0, cap);
    return [
      stepBlock(`Mobility Routine: ${labelRoutine(routineKey)}`, "Move slow • breathe • no forcing"),
      ...chosen.map(item => stepList(item, "Controlled reps / holds", [], "Tap Done"))
    ];
  }

  /* -----------------------------
     PREVIEW RENDER
  ----------------------------- */
  function renderPreview(items){
    previewList.innerHTML = "";
    items.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "preview-item";
      row.innerHTML = `
        <div class="name">${idx + 1}. ${escapeHtml(it.left)}</div>
        <div class="prescription">${escapeHtml(it.right)}</div>
      `;
      previewList.appendChild(row);
    });
  }

  /* -----------------------------
     GENERATE
  ----------------------------- */
  generateBtn.addEventListener("click", () => {
    clearTimer();
    steps = [];
    stepIndex = 0;

    const { goal, difficulty, equipment, time, routine } = state;

    const presc = prescriptionFor(goal, difficulty);
    const rest = restFor(goal, difficulty);

    const startNotes = [
      ...(SESSION_COACHING[goal]?.start || []),
      ...EFFORT_BY_DIFFICULTY[difficulty]
    ];
    const endNotes = [
      ...(SESSION_COACHING[goal]?.end || []),
      "If anything pinched/sharp: swap movement next time."
    ];

    // Build steps
    steps.push(...buildWarmup(goal, equipment, time));

    steps.push(stepCoach(
      "Coach Notes (Start)",
      `${goal.toUpperCase()} • ${difficulty.toUpperCase()} • ${labelEquipment(equipment)} • ${time} mins`,
      startNotes
    ));

    const routineKey = pickRoutine(goal, routine, time);

    if (goal === "mobility" || goal === "recovery"){
      steps.push(...buildMobilitySession(routineKey, time));
    } else {
      const pool = (POOLS[equipment] || []).slice();
      shuffle(pool);
      const n = EXERCISE_COUNT_BY_TIME[time] ?? 7;
      const chosen = pool.slice(0, Math.min(n, pool.length));

      chosen.forEach((ex, i) => {
        steps.push(stepExercise(ex.name, presc, rest, cuesFor(ex)));
        if (i !== chosen.length - 1) steps.push(stepRest(rest));
      });
    }

    steps.push(...buildCooldown(time));

    steps.push(stepCoach("Coach Notes (End)", "Recover well • progress slowly", endNotes));
    steps.push(stepFinish());

    // Preview
    meta.textContent = `${goal.toUpperCase()} • ${difficulty.toUpperCase()} • ${labelEquipment(equipment)} • ${time} mins • Mobility: ${labelRoutine(routineKey)}`;

    const previewItems = [];
    previewItems.push({ left: "Warm‑up (RAMP)", right: "Raise • Activate • Mobilise • Potentiate" });
    previewItems.push({ left: "Coach notes", right: "Start + End" });

    if (goal === "mobility" || goal === "recovery"){
      const list = MOBILITY_ROUTINES[routineKey] || MOBILITY_ROUTINES.fullbody;
      const cap = time <= 15 ? 6 : time <= 30 ? 8 : 10;
      list.slice(0, cap).forEach(x => previewItems.push({ left: x, right: "Mobility" }));
    } else {
      const pool = (POOLS[equipment] || []).slice();
      shuffle(pool);
      (pool.slice(0, Math.min(EXERCISE_COUNT_BY_TIME[time] ?? 7, pool.length))).forEach(x => {
        previewItems.push({ left: x.name, right: presc });
      });
    }

    previewItems.push({ left: "Warm‑down", right: "Easy movement + static stretches + breathing" });

    renderPreview(previewItems);
    startBtn.disabled = false;
  });

  /* -----------------------------
     START / EXIT / SKIP
  ----------------------------- */
  startBtn.addEventListener("click", () => {
    if (!steps.length) return;

    clearTimer();
    stepIndex = 0;

    workoutScreen.classList.remove("hidden");
    workoutScreen.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    renderStep();
  });

  exitWorkoutBtn.addEventListener("click", () => {
    clearTimer();
    workoutScreen.classList.add("hidden");
    workoutScreen.setAttribute("aria-hidden", "true");
    workoutCard.innerHTML = "";
    document.body.style.overflow = "";
  });

  skipStepBtn.addEventListener("click", () => {
    clearTimer();
    stepIndex = Math.min(stepIndex + 1, steps.length - 1);
    renderStep();
  });

  /* -----------------------------
     RENDER LOOP
  ----------------------------- */
  function renderStep(){
    clearTimer();
    updateProgress();

    const step = steps[stepIndex];
    if (!step) return;

    modeText.textContent = modeLabel(step.type);

    if (step.type === "block") return renderSimple(step.title, step.subtitle, "Tap to continue");
    if (step.type === "coach") return renderCoachCard(step);
    if (step.type === "timer") return renderTimerCard(step);
    if (step.type === "list") return renderListCard(step);
    if (step.type === "exercise") return renderExerciseCard(step);
    if (step.type === "rest") return renderRestCard(step.seconds);
    return renderSimple("SESSION COMPLETE", "Tap Exit to return", "");
  }

  function renderSimple(title, subtitle, hint){
    workoutCard.innerHTML = `
      <div class="card">
        <h3>${escapeHtml(title)}</h3>
        <p class="sub">${escapeHtml(subtitle || "")}</p>
        ${hint ? `<div class="hintline">${escapeHtml(hint)}</div>` : ""}
      </div>
    `;
    workoutCard.onclick = next;
  }

  function renderCoachCard(step){
    workoutCard.innerHTML = `
      <div class="card">
        <h3>${escapeHtml(step.title)}</h3>
        <p class="sub">${escapeHtml(step.subtitle || "")}</p>
        ${bulletsBox("Notes", step.bullets || [])}
        <div class="hintline">Tap to continue</div>
      </div>
    `;
    workoutCard.onclick = next;
  }

  function renderTimerCard(step){
    let remaining = Number(step.seconds) || 60;

    workoutCard.innerHTML = `
      <div class="card">
        <h3>${escapeHtml(step.title)}</h3>
        <p class="sub">${escapeHtml(step.subtitle || "")}</p>
        <div class="big" id="countNum">${remaining}</div>
        ${step.bullets?.length ? bulletsBox("Do this", step.bullets) : ""}
        <div class="hintline">Tap to skip • Auto‑advance at 0</div>
      </div>
    `;

    const countNum = document.getElementById("countNum");
    workoutCard.onclick = next;

    timer = setInterval(() => {
      remaining--;
      if (countNum) countNum.textContent = String(remaining);
      if (remaining <= 0) next();
    }, 1000);
  }

  function renderListCard(step){
    workoutCard.innerHTML = `
      <div class="card">
        <h3>${escapeHtml(step.title)}</h3>
        <p class="sub">${escapeHtml(step.subtitle || "")}</p>
        ${step.bullets?.length ? bulletsBox("Do this", step.bullets) : ""}
        <div class="pills"><div class="pill">${escapeHtml(step.doneText || "Tap Done")}</div></div>
        <div class="hintline">Tap anywhere = Done</div>
      </div>
    `;
    workoutCard.onclick = next;
  }

  function renderExerciseCard(step){
    workoutCard.innerHTML = `
      <div class="card">
        <h3>${escapeHtml(step.name)}</h3>
        <p class="sub">${escapeHtml(step.prescription || "")}</p>
        <div class="pills">
          <div class="pill">Rest: ${step.restSeconds}s</div>
          <div class="pill">Tap to complete</div>
        </div>
        ${step.cues?.length ? bulletsBox("Cues", step.cues) : ""}
        <div class="hintline">Tap anywhere to move on</div>
      </div>
    `;
    workoutCard.onclick = next;
  }

  function renderRestCard(seconds){
    let remaining = Number(seconds) || 45;

    workoutCard.innerHTML = `
      <div class="card">
        <h3>REST</h3>
        <div class="big" id="restNum">${remaining}</div>
        <p class="sub">Tap to skip</p>
        <div class="pills"><div class="pill">Auto‑advance at 0</div></div>
      </div>
    `;

    const restNum = document.getElementById("restNum");
    workoutCard.onclick = next;

    timer = setInterval(() => {
      remaining--;
      if (restNum) restNum.textContent = String(remaining);
      if (remaining <= 0) next();
    }, 1000);
  }

  function next(){
    clearTimer();
    stepIndex = Math.min(stepIndex + 1, steps.length - 1);
    renderStep();
  }

  function updateProgress(){
    const total = steps.length || 0;
    const current = Math.min(stepIndex + 1, total);

    progressText.textContent = `${current} / ${total}`;
    const pct = total ? Math.round(((current - 1) / total) * 100) : 0;
    progressFill.style.width = `${clamp(pct, 0, 100)}%`;
  }

  function modeLabel(type){
    if (type === "timer" || type === "list" || type === "block") return "Warm‑up / Routine";
    if (type === "coach") return "Coach";
    if (type === "exercise") return "Work";
    if (type === "rest") return "Rest";
    if (type === "finish") return "Complete";
    return "Session";
  }

  function clearTimer(){
    if (timer){
      clearInterval(timer);
      timer = null;
    }
  }

  function bulletsBox(title, bullets){
    const items = (bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("");
    return `
      <div class="noteBox">
        <strong>${escapeHtml(title)}</strong>
        <ul>${items}</ul>
      </div>
    `;
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
