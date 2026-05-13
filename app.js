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
    conditioning: 30,  // used for between-interval rests, not "sets"
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
      { name: "DB Split Squat", tags: ["unilateral","squat"] },
      { name: "DB Thruster (light)", tags: ["conditioning"] }
    ],
    kettlebell: [
      { name: "KB Swing", tags: ["hinge","conditioning"] },
      { name: "KB Goblet Squat", tags: ["squat"] },
      { name: "KB Clean & Press", tags: ["push"] },
      { name: "KB One‑Arm Row", tags: ["pull"] },
      { name: "Suitcase Carry", tags: ["carry"] },
      { name: "KB Complex (light)", tags: ["conditioning"] }
    ],
    sandbag: [
      { name: "Sandbag Clean", tags: ["hinge"] },
      { name: "Bear Hug Squat", tags: ["squat"] },
      { name: "Sandbag Carry", tags: ["carry"] },
      { name: "Sandbag Reverse Lunge", tags: ["unilateral"] },
      { name: "Sandbag Row", tags: ["pull"] },
      { name: "Sandbag EMOM (light)", tags: ["conditioning"] }
    ],
    fullgym: [
      { name: "Back Squat", tags: ["squat"] },
      { name: "Deadlift", tags: ["hinge"] },
      { name: "Bench Press", tags: ["push"] },
      { name: "Row", tags: ["pull"] },
      { name: "Overhead Press", tags: ["push"] },
      { name: "Lat Pulldown / Pull‑ups", tags: ["pull"] },
      { name: "Bike / Rower", tags: ["conditioning"] },
      { name: "Sled / Incline Walk", tags: ["conditioning"] }
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
      start: ["Quality reps + full recovery.", "Stop the set when speed/form drops."]
    },
    hypertrophy: {
      start: ["Chase tension: controlled reps, full range.", "Stop 0–2 reps short of ugly reps."]
    },
    conditioning: {
      start: ["Start smoother than you think; build speed.", "Repeatable pace > sprinting the first block."]
    },
    recovery: {
      start: ["Finish feeling better than you started.", "Keep it easy; nasal breathing if possible."]
    },
    mobility: {
      start: ["Move slowly into end ranges—no forcing.", "Long exhale helps down‑regulate."]
    }
  };

  // End-of-session coach note “options”
  const END_NOTE_OPTIONS = {
    strength: {
      progression: [
        "If bar speed stayed crisp: add 2.5–5% next time.",
        "If reps slowed: keep load and tighten technique."
      ],
      recovery: [
        "Hydrate + get protein in. Keep steps up today.",
        "If joints feel beat up: swap one lift for a variation next time."
      ],
      technique: [
        "Pick one cue to own next session (brace, tempo, depth).",
        "Film one set next time to check positions."
      ]
    },
    hypertrophy: {
      progression: [
        "Next time: +1 rep per set OR +2.5–5% load (not both).",
        "If you hit top reps easily: increase load next session."
      ],
      pump: [
        "If pump died early: shorten rests slightly or slow eccentrics.",
        "If you felt great: add one extra set for the main pattern."
      ],
      balance: [
        "If push volume > pull: add one pulling accessory next time.",
        "If legs dominated: start next session with upper focus."
      ]
    },
    conditioning: {
      pacing: [
        "If you blew up: start 10% easier for first 2 blocks next time.",
        "If you stayed smooth: reduce rest by 5–10s or add 1 round."
      ],
      aerobic: [
        "If breathing never settled: keep it in ‘talk test’ pace next time.",
        "If you recovered quickly: add 2–3 mins easy cooldown."
      ],
      intent: [
        "Chase consistency: matching rounds beats a single fast one.",
        "Relax shoulders; efficiency is a performance skill."
      ]
    },
    recovery: {
      downregulate: [
        "If still wired: add 2 mins slow breathing (long exhale).",
        "If stiff: repeat this session in 48 hours."
      ],
      habits: [
        "Aim for a short mobility snack later today (5 mins).",
        "Keep movement gentle and frequent today."
      ]
    },
    mobility: {
      retest: [
        "Retest a tight area now — smoother range is the goal.",
        "Do this routine 10 mins most days for best results."
      ],
      focus: [
        "Pick one area (hips/shoulders) and stay consistent for 2 weeks.",
        "If something pinches: reduce range and slow down."
      ]
    }
  };

  const EFFORT_BY_DIFFICULTY = {
    beginner: ["Stay 2–3 reps in reserve (RIR).", "Prioritise form and control."],
    intermediate: ["Most sets: 1–2 reps in reserve.", "One hard set is fine—don’t redline everything."],
    advanced: ["Last set can push close to technical failure.", "Autoregulate: crisp reps = progress next time."],
    elite: ["High intent; manage fatigue—quality stays king.", "If output drops: reduce load or extend rest."]
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
     HELPERS
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

  // IMPORTANT: conditioning has no sets/reps. It's effort + time.
  function prescriptionFor(goal, difficulty, time){
    const effort = conditioningEffort(difficulty);
    if (goal === "conditioning") {
      return `${effort.label} • ${effort.talkTest} • blocks total ~${time} mins`;
    }

    const intensity =
      difficulty === "beginner" ? "RPE 6" :
      difficulty === "intermediate" ? "RPE 7" :
      difficulty === "advanced" ? "RPE 8" : "RPE 9";

    if (goal === "strength") return `3–5 sets × 3–5 reps • ${intensity}`;
    if (goal === "hypertrophy") return `3–4 sets × 8–12 reps • ${intensity}`;
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

  function conditioningEffort(difficulty){
    if (difficulty === "beginner") return { label:"Easy–Moderate", talkTest:"can speak full sentences", rpe:"RPE 5–6" };
    if (difficulty === "intermediate") return { label:"Moderate–Hard", talkTest:"short sentences", rpe:"RPE 7–8" };
    if (difficulty === "advanced") return { label:"Hard", talkTest:"few words only", rpe:"RPE 8–9" };
    return { label:"Very Hard", talkTest:"few words only", rpe:"RPE 9" };
  }

  function pickEndNotes(goal){
    const buckets = END_NOTE_OPTIONS[goal] || {};
    const keys = Object.keys(buckets);
    if (!keys.length) return ["Recover well.", "Progress slowly."];
    shuffle(keys);
    const selected = [];
    for (const k of keys.slice(0,2)){
      const arr = buckets[k];
      if (arr && arr.length) selected.push(arr[Math.floor(Math.random() * arr.length)]);
    }
    selected.push("If anything pinched/sharp: swap movement next time.");
    return selected;
  }

  /* -----------------------------
     STEP BUILDERS
  ----------------------------- */
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

  /* -----------------------------
     WARM-UP (single page)
     (one screen listing stretches/activations)
     Inspired by RAMP, but shown as a single list. [1](https://stackoverflow.com/questions/79512658/cant-trigger-push-workflow-when-push-happens-in-action)[2](https://github.com/orgs/community/discussions/22495)
  ----------------------------- */
  function buildWarmupSinglePage(goal, equipment){
    const bullets = [
      "Neck + shoulder rolls (30s)",
      "Arm circles (20s each way)",
      "Cat‑cow (6 reps)",
      "World’s greatest stretch (2/side)",
      "Hip circles (6/side)",
      "Ankle rocks (10/side)"
    ];

    if (goal === "conditioning") bullets.push("2 × 20s build‑ups (easy → hard)");
    else bullets.push("2 light warm‑up sets of the first movement");

    if (equipment === "kettlebell") bullets.push("KB halo (6/side) + light swings (10)");
    if (equipment === "sandbag") bullets.push("Bear hug hold (20s) + empty clean pattern (5)");

    return [
      stepList("Warm‑up (3–5 mins)", "Quick prep — loosen + switch on", bullets, "Tap Done to start")
    ];
  }

  /* -----------------------------
     WARM-DOWN
     (easy movement + static stretches + breathing) 
  ----------------------------- */
  function buildCooldown(time){
    const easy = time <= 15 ? 180 : 300;
    const hold = time <= 30 ? "10–30s" : "15–30s";
    return [
      stepTimer("Warm‑down: easy movement", "Bring breathing down", easy, ["Walk / easy bike", "Relax shoulders", "Longer exhale than inhale"]),
      stepList("Static stretches", `Hold each for ${hold}`, ["Hip flexor stretch", "Hamstring stretch", "Calf stretch", "Chest/pec stretch", "Lat stretch"], "Tap Done"),
      stepTimer("Breathing", "Shift to calm", 90, ["4s in / 6–8s out", "Ribs soften down", "Jaw/shoulders unclench"])
    ];
  }

  function buildMobilitySession(routineKey, time){
    const list = MOBILITY_ROUTINES[routineKey] || MOBILITY_ROUTINES.fullbody;
    const cap = time <= 15 ? 6 : time <= 30 ? 8 : time <= 45 ? 10 : list.length;
    const chosen = list.slice(0, cap);
    return [
      stepCoach(`Mobility: ${labelRoutine(routineKey)}`, "Move slow • breathe • no forcing", ["Focus on control, not range.", "Stop if you get pinching pain."]),
      ...chosen.map(item => stepList(item, "Controlled reps / holds", [], "Tap Done"))
    ];
  }

  /* -----------------------------
     CONDITIONING BUILD (timed blocks + effort)
     No sets/reps — just effort + time blocks.
  ----------------------------- */
  function buildConditioningBlocks(equipment, difficulty, totalMins){
    const effort = conditioningEffort(difficulty);
    const restBetween = clamp(restFor("conditioning", difficulty), 10, 60);

    // Choose a conditioning movement
    const pool = (POOLS[equipment] || []).filter(x => (x.tags || []).includes("conditioning"));
    const fallback = [{ name:"Fast walk / step‑ups", tags:["conditioning"] }];
    const engine = (pool.length ? pool : fallback);

    // Interval structure by time
    // (work seconds, rounds)
    const plan =
      totalMins <= 15 ? { work: 45, rounds: 8 } :
      totalMins <= 30 ? { work: 60, rounds: 10 } :
      totalMins <= 45 ? { work: 75, rounds: 12 } :
      totalMins <= 60 ? { work: 90, rounds: 14 } :
                        { work: 90, rounds: 18 };

    const chosen = engine[Math.floor(Math.random() * engine.length)];
    const blocks = [];

    blocks.push(stepCoach(
      "Conditioning Focus",
      `${effort.label} • ${effort.rpe} • ${effort.talkTest}`,
      [
        "Goal: consistent pace across rounds.",
        "If you blow up early, reduce pace 10% and finish strong."
      ]
    ));

    for (let i = 1; i <= plan.rounds; i++){
      blocks.push(stepTimer(
        `WORK ${i}/${plan.rounds}: ${chosen.name}`,
        `${effort.label} • ${effort.talkTest}`,
        plan.work,
        ["Smooth breathing", "Relax shoulders", "Move efficiently"]
      ));
      if (i !== plan.rounds){
        blocks.push(stepTimer("REST", "Easy breathing, shake out", restBetween, ["Slow down fully", "Get ready for next round"]));
      }
    }

    return blocks;
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

    const presc = prescriptionFor(goal, difficulty, time);
    const rest = restFor(goal, difficulty);
    const routineKey = pickRoutine(goal, routine, time);

    const startNotes = [
      ...(SESSION_COACHING[goal]?.start || []),
      ...EFFORT_BY_DIFFICULTY[difficulty]
    ];
    const endNotes = pickEndNotes(goal);

    // Warm-up: single list screen
    steps.push(...buildWarmupSinglePage(goal, equipment));

    // Coach start
    steps.push(stepCoach(
      "Coach Notes (Start)",
      `${goal.toUpperCase()} • ${difficulty.toUpperCase()} • ${labelEquipment(equipment)} • ${time} mins`,
      startNotes
    ));

    // Main work
    if (goal === "mobility" || goal === "recovery"){
      steps.push(...buildMobilitySession(routineKey, time));
    } else if (goal === "conditioning"){
      steps.push(...buildConditioningBlocks(equipment, difficulty, time));
    } else {
      // Strength / Hypertrophy blocks
      const pool = (POOLS[equipment] || []).slice();
      shuffle(pool);
      const n = EXERCISE_COUNT_BY_TIME[time] ?? 7;
      const chosen = pool.slice(0, Math.min(n, pool.length));

      chosen.forEach((ex, i) => {
        steps.push(stepExercise(ex.name, presc, rest, cuesFor(ex)));
        if (i !== chosen.length - 1) steps.push(stepRest(rest));
      });
    }

    // Warm-down
    steps.push(...buildCooldown(time));

    // Coach end
    steps.push(stepCoach("Coach Notes (End)", "Options + next steps", endNotes));

    // Finish
    steps.push(stepFinish());

    // Preview
    meta.textContent = `${goal.toUpperCase()} • ${difficulty.toUpperCase()} • ${labelEquipment(equipment)} • ${time} mins • Mobility: ${labelRoutine(routineKey)}`;

    const previewItems = [];
    previewItems.push({ left: "Warm‑up (single page)", right: "Quick stretches + activation" });
    previewItems.push({ left: "Coach notes", right: "Start + End" });

    if (goal === "mobility" || goal === "recovery"){
      const list = MOBILITY_ROUTINES[routineKey] || MOBILITY_ROUTINES.fullbody;
      const cap = time <= 15 ? 6 : time <= 30 ? 8 : 10;
      list.slice(0, cap).forEach(x => previewItems.push({ left: x, right: "Mobility" }));
    } else if (goal === "conditioning"){
      const eff = conditioningEffort(difficulty);
      previewItems.push({ left: "Conditioning blocks", right: `${eff.label} • ${eff.rpe} • timed intervals` });
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
    if (type === "timer" || type === "list") return "Warm‑up / Work";
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
