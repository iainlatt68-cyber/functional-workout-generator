console.log("✅ app.js loaded");

/* ==============================
   STATE
   ============================== */
const state = {
  goal: "hypertrophy",
  difficulty: "intermediate",
  equipment: "fullgym",
  time: 30,
  routine: "auto"
};

let workout = [];      // steps: warmup/exercise/rest/cooldown/finish
let stepIndex = 0;
let timer = null;

/* ==============================
   DOM
   ============================== */
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

/* ==============================
   BUTTON UI -> STATE
   ============================== */
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

/* ==============================
   EVENTS
   ============================== */
generateBtn.addEventListener("click", generateWorkout);
startBtn.addEventListener("click", startWorkout);
exitWorkoutBtn.addEventListener("click", exitWorkout);
skipStepBtn.addEventListener("click", skipCurrentStep);

/* ==============================
   CORE CONTENT LIBRARIES
   ============================== */

/** Exercise pools include tags for cue selection */
const POOLS = {
  dumbbells: [
    { name: "DB Goblet Squat", tags: ["squat","lower"] },
    { name: "DB Romanian Deadlift", tags: ["hinge","lower"] },
    { name: "DB Bench / Floor Press", tags: ["push","upper"] },
    { name: "DB One‑Arm Row", tags: ["pull","upper"] },
    { name: "DB Split Squat", tags: ["squat","lower","unilateral"] },
    { name: "DB Shoulder Press", tags: ["push","shoulders"] },
    { name: "DB Farmer Carry", tags: ["carry","grip"] }
  ],
  kettlebell: [
    { name: "KB Swing", tags: ["hinge","power"] },
    { name: "KB Goblet Squat", tags: ["squat","lower"] },
    { name: "KB Clean & Press", tags: ["push","power"] },
    { name: "KB One‑Arm Row", tags: ["pull","upper"] },
    { name: "KB Racked Reverse Lunge", tags: ["lower","unilateral"] },
    { name: "Suitcase Carry", tags: ["carry","core"] }
  ],
  sandbag: [
    { name: "Sandbag Clean", tags: ["hinge","power"] },
    { name: "Bear Hug Squat", tags: ["squat","lower"] },
    { name: "Sandbag Carry", tags: ["carry","core"] },
    { name: "Ground‑to‑Shoulder", tags: ["power","hinge"] },
    { name: "Sandbag Reverse Lunge", tags: ["lower","unilateral"] },
    { name: "Sandbag Row", tags: ["pull","upper"] }
  ],
  fullgym: [
    { name: "Back Squat", tags: ["squat","lower"] },
    { name: "Deadlift / Trap Bar Deadlift", tags: ["hinge","lower"] },
    { name: "Bench Press", tags: ["push","upper"] },
    { name: "Row (Cable/Bar/DB)", tags: ["pull","upper"] },
    { name: "Overhead Press", tags: ["push","shoulders"] },
    { name: "Lat Pulldown / Pull‑ups", tags: ["pull","upper"] },
    { name: "Walking Lunges", tags: ["lower","unilateral"] },
    { name: "Bike / Rower (easy‑hard)", tags: ["conditioning","engine"] }
  ]
};

/** Exercise cues by tag */
const CUES_BY_TAG = {
  squat: [
    "Brace first, then descend under control.",
    "Drive the floor away; keep knees tracking over toes."
  ],
  hinge: [
    "Hips back; keep spine long—don’t chase depth with rounding.",
    "Feel hamstrings load; stand tall and squeeze glutes."
  ],
  push: [
    "Ribs down, shoulder blades set—press smoothly.",
    "Stop the set if form breaks; keep elbows stacked."
  ],
  pull: [
    "Pull elbow toward hip; don’t yank with biceps.",
    "Pause for a beat at the top; control the return."
  ],
  carry: [
    "Tall posture; ribs stacked over pelvis.",
    "Slow steps; don’t lean—stay symmetrical."
  ],
  unilateral: [
    "Control the bottom position; keep pelvis level.",
    "Quality reps > load—own each side."
  ],
  conditioning: [
    "Aim for repeatable pace—don’t sprint the first minute.",
    "Smooth breathing; relax shoulders and jaw."
  ],
  mobility: [
    "Slow into end range—no bouncing.",
    "Breathe out longer than in; stay relaxed."
  ]
};

/** Session coaching notes (start/end) */
const SESSION_COACHING = {
  strength: {
    start: [
      "Today is about quality reps + full recovery.",
      "Stop the set when speed/form drops—save the joints."
    ],
    end: [
      "If it felt easy: increase load next time, not speed.",
      "If you ground reps: keep the same load and improve bar path."
    ]
  },
  hypertrophy: {
    start: [
      "Chase tension: controlled eccentrics and full range.",
      "Stop 0–2 reps short of ugly reps (technical failure only)."
    ],
    end: [
      "Progression options: +1 rep per set, or +2.5–5% load.",
      "If pumps vanished early: shorten rests slightly next time."
    ]
  },
  conditioning: {
    start: [
      "Repeatable pace beats one heroic round.",
      "Smooth transitions—relax shoulders, steady breathing."
    ],
    end: [
      "If you blew up: start 10% easier for first 2 blocks next time.",
      "If you stayed smooth: reduce rest or add a block."
    ]
  },
  recovery: {
    start: [
      "You should finish feeling better than you started.",
      "Keep effort easy; nasal breathing if possible."
    ],
    end: [
      "If you’re still tense: extend warm‑down and breathing by 2–3 mins.",
      "Consistency wins—repeat this 2–4×/week."
    ]
  },
  mobility: {
    start: [
      "Move slowly into end ranges—no forcing.",
      "Breathe to relax; long exhale helps down‑regulate."
    ],
    end: [
      "Retest a tight area—aim for smoother, not extreme range.",
      "Do 10 minutes most days; short and frequent works."
    ]
  }
};

/** Effort/regulation notes by difficulty */
const EFFORT_BY_DIFFICULTY = {
  beginner: [
    "Stay 2–3 reps in reserve (RIR) on strength work.",
    "Prioritise form—leave ego out."
  ],
  intermediate: [
    "Most sets: 1–2 reps in reserve.",
    "One hard set is fine; don’t redline every set."
  ],
  advanced: [
    "Push close to technical failure on last set.",
    "Autoregulate load: crisp reps = add weight next time."
  ],
  elite: [
    "High intent; manage fatigue—quality stays king.",
    "If output drops, reduce load or extend rest."
  ]
};

/* ==============================
   TIME / VOLUME / REST RULES
   ============================== */

/** Primary working set count scales with time */
const EXERCISE_COUNT_BY_TIME = {
  15: 4,
  30: 7,
  45: 10,
  60: 12,
  90: 16
};

/** Baseline rest (seconds) by goal */
const REST_BY_GOAL = {
  strength: 120,
  hypertrophy: 75,
  conditioning: 25,
  recovery: 35,
  mobility: 15
};

/** Difficulty rest adjustments (seconds) */
const REST_ADJ_BY_DIFFICULTY = {
  beginner: +20,
  intermediate: 0,
  advanced: -10,
  elite: -15
};

function prescriptionFor(goal, difficulty) {
  const intensity =
    difficulty === "beginner" ? "RPE 6" :
    difficulty === "intermediate" ? "RPE 7" :
    difficulty === "advanced" ? "RPE 8" : "RPE 9";

  if (goal === "strength") return `3–5 sets × 3–5 reps • ${intensity}`;
  if (goal === "hypertrophy") return `3–4 sets × 8–12 reps • ${intensity}`;
  if (goal === "conditioning") return `Work 40s / Rest 20s • repeatable pace`;
  if (goal === "recovery") return `Easy pace • nasal breathing • quality reps`;
  if (goal === "mobility") return `45–60s per move • slow control • breathe`;
  return `Work at ${intensity}`;
}

function restFor(goal, difficulty) {
  const base = REST_BY_GOAL[goal] ?? 60;
  const adj = REST_ADJ_BY_DIFFICULTY[difficulty] ?? 0;
  return clamp(base + adj, 10, 180);
}

/* ==============================
   WARM-UP (RAMP)
   RAMP: Raise / Activate / Mobilise / Potentiate [1](https://ohanlonperformance.com/ramp-warm-up-guide/)[2](https://www.performancepurpose.ca/article/the-ramp-warm-up-protocol-for-skills-and-sampc)
   ============================== */
function buildWarmup(goal, equipment, time) {
  // Shorter warm-up for 15 mins; longer for 60–90
  const raiseSecs = time <= 15 ? 90 : time <= 30 ? 150 : 180;

  const warm = [
    { type:"block", title:"Warm‑up (RAMP)", subtitle:"Raise • Activate • Mobilise • Potentiate" },
    { type:"timer", title:"Raise", subtitle:"Light movement to warm up", seconds: raiseSecs,
      bullets: ["Walk/jog/bike easy", "Nose breathing if possible"] },

    { type:"reps", title:"Activate", subtitle:"Switch muscles on", reps:"2 rounds",
      bullets: ["Glute bridge × 10", "Scap push‑ups × 8", "Dead bug × 6/side"] },

    { type:"reps", title:"Mobilise", subtitle:"Open key joints", reps:"1 round",
      bullets: ["World’s greatest stretch × 3/side", "Hip circles × 6/side", "T‑spine rotation × 5/side"] },

    { type:"reps", title:"Potentiate", subtitle:"Prime for the session", reps:"2 minutes",
      bullets: goal === "conditioning"
        ? ["3 × 10s faster pace + 20s easy", "2–3 powerful jumps (optional)"]
        : ["2 light sets of first lift/pattern", "3 crisp reps at moderate effort"]
    }
  ];

  // Small equipment-specific tweak
  if (equipment === "kettlebell") {
    warm.push({ type:"reps", title:"KB Prep", subtitle:"Hinge + shoulders", reps:"60–90s",
      bullets:["KB halo × 6/side", "Hip hinge drill × 8", "Light swings × 10"]});
  }
  if (equipment === "sandbag") {
    warm.push({ type:"reps", title:"Sandbag Prep", subtitle:"Brace + hinge", reps:"60–90s",
      bullets:["Bear hug hold × 20s", "Hip hinge drill × 8", "Empty clean pattern × 5"]});
  }

  return warm;
}

/* ==============================
   COOL-DOWN / WARM-DOWN
   Cool down commonly includes 5–10 mins easy movement + static stretches; hold 10–30s+ [3](https://www.healthline.com/health/exercise-fitness/cooldown-exercises)
   ============================== */
function buildCooldown(goal, time) {
  const easySecs = time <= 15 ? 180 : 300; // 3–5 mins
  const stretchHold = time <= 30 ? "20–30s" : "30–60s";

  return [
    { type:"block", title:"Warm‑down", subtitle:"Down‑regulate + restore length" },

    { type:"timer", title:"Easy movement", subtitle:"Bring breathing down", seconds: easySecs,
      bullets:["Walk / easy bike", "Shoulders relaxed", "Longer exhale than inhale"] },

    { type:"reps", title:"Stretch (lower)", subtitle:`Hold each for ${stretchHold}`, reps:"2–3 mins",
      bullets:["Hip flexor stretch", "Hamstring stretch", "Calf stretch"] },

    { type:"reps", title:"Stretch (upper)", subtitle:`Hold each for ${stretchHold}`, reps:"2–3 mins",
      bullets:["Chest doorway stretch", "Lat stretch", "Upper back rotation"] },

    { type:"timer", title:"Breathing", subtitle:"Shift to calm", seconds: 90,
      bullets:["4s in / 6–8s out", "Ribs soften down", "Jaw/shoulders unclench"] }
  ];
}

/* ==============================
   MOBILITY ROUTINES (named flows)
   ============================== */
const MOBILITY_ROUTINES = {
  fullbody: [
    "90/90 breathing (5–8 breaths)",
    "Cat‑cow (6–8 reps)",
    "Thread‑the‑needle (5/side)",
    "90/90 hip switches (6 reps)",
    "Ankle rocks (10/side)",
    "Cossack squat rocks (6/side)",
    "Wall slides (10 reps)",
    "Child’s pose + side reach (45s/side)"
  ],
  hips: [
    "90/90 hip switches (8 reps)",
    "Hip flexor lunge + reach (45s/side)",
    "Adductor rock‑backs (8/side)",
    "Pigeon / figure‑4 (45s/side)",
    "Couch stretch (45–60s/side)",
    "Glute bridge hold (30s)",
    "Deep squat hold (45s)"
  ],
  shoulders: [
    "Arm circles (30s each way)",
    "Wall slides (10 reps)",
    "Scap push‑ups (8–10 reps)",
    "Thread‑the‑needle (5/side)",
    "Doorway pec stretch (45s/side)",
    "Lat stretch (45s/side)"
  ],
  tspine: [
    "Cat‑cow (6–8 reps)",
    "Open book rotations (6/side)",
    "Thread‑the‑needle (5/side)",
    "Quadruped T‑spine rotations (6/side)",
    "Child’s pose breathing (6 breaths)"
  ],
  postrun: [
    "Easy walk (2 mins)",
    "Calf stretch (45s/side)",
    "Hamstring stretch (45s/side)",
    "Hip flexor stretch (60s/side)",
    "Glute stretch (45s/side)",
    "T‑spine open book (5/side)"
  ]
};

function pickRoutine(goal, routineChoice, time) {
  // If user picks something explicit, use it
  if (routineChoice && routineChoice !== "auto") return routineChoice;

  // Auto-selection by goal/time
  if (goal === "mobility") return time >= 45 ? "fullbody" : "hips";
  if (goal === "recovery") return time >= 30 ? "fullbody" : "tspine";
  return "fullbody";
}

function buildMobilitySession(goal, routineKey, time) {
  const routine = MOBILITY_ROUTINES[routineKey] || MOBILITY_ROUTINES.fullbody;
  const cap = time <= 15 ? 6 : time <= 30 ? 8 : time <= 45 ? 10 : routine.length;
  const chosen = routine.slice(0, cap);

  return [
    { type:"block", title:`Mobility Routine: ${labelRoutine(routineKey)}`, subtitle:"Move slow • breathe • no forcing" },
    ...chosen.map(item => ({
      type:"reps",
      title:item,
      subtitle:"Tap Done when complete",
      reps:"",
      bullets:[]
    }))
  ];
}

/* ==============================
   GENERATE WORKOUT
   ============================== */
function generateWorkout() {
  clearTimer();
  workout = [];
  stepIndex = 0;

  const { goal, difficulty, equipment, time, routine } = state;

  // Session coaching + effort notes at start and end
  const sessionStartNotes = [
    ...(SESSION_COACHING[goal]?.start || []),
    ...EFFORT_BY_DIFFICULTY[difficulty]
  ];
  const sessionEndNotes = [
    ...(SESSION_COACHING[goal]?.end || []),
    "If anything hurt sharply or pinched: stop and swap the movement next time."
  ];

  // For Mobility/Recovery: use named routine as the main session (plus short warm-up + warm-down)
  const routineKey = pickRoutine(goal, routine, time);

  // Warm-up first (still useful even for mobility days)
  workout.push(...buildWarmup(goal, equipment, time));

  // A “coach note” card before the main work
  workout.push({
    type:"coach",
    title:"Coach Notes (Start)",
    subtitle:`${goal.toUpperCase()} • ${difficulty.toUpperCase()} • ${labelEquipment(equipment)} • ${time} mins`,
    bullets: sessionStartNotes
  });

  if (goal === "mobility" || goal === "recovery") {
    workout.push(...buildMobilitySession(goal, routineKey, time));
  } else {
    // Main training block
    const pool = (POOLS[equipment] || []).slice();
    if (!pool.length) {
      meta.textContent = "No exercises found for that equipment.";
      previewList.innerHTML = "";
      startBtn.disabled = true;
      return;
    }

    const n = EXERCISE_COUNT_BY_TIME[time] ?? 7;
    shuffle(pool);
    const chosen = pool.slice(0, Math.min(n, pool.length));

    const presc = prescriptionFor(goal, difficulty);
    const rest = restFor(goal, difficulty);

    // Preview
    meta.textContent = `${goal.toUpperCase()} • ${difficulty.toUpperCase()} • ${labelEquipment(equipment)} • ${time} mins`;
    renderPreview(chosen, presc, rest);

    chosen.forEach((ex, i) => {
      const cues = cuesForExercise(ex);

      workout.push({
        type: "exercise",
        name: ex.name,
        prescription: presc,
        restSeconds: rest,
        cues
      });

      if (i !== chosen.length - 1) {
        workout.push({ type: "rest", seconds: rest });
      }
    });
  }

  // Cool-down/warm-down always
  workout.push(...buildCooldown(goal, time));

  // End coaching notes
  workout.push({
    type:"coach",
    title:"Coach Notes (End)",
    subtitle:"Keep the habit. Progress slowly.",
    bullets: sessionEndNotes
  });

  // Finish
  workout.push({ type: "finish" });

  // If goal is mobility/recovery, build a preview from routine
  if (goal === "mobility" || goal === "recovery") {
    const routineItems = (MOBILITY_ROUTINES[routineKey] || []).slice(0, time <= 15 ? 6 : time <= 30 ? 8 : 10);
    meta.textContent = `${goal.toUpperCase()} • ${difficulty.toUpperCase()} • ${labelEquipment(equipment)} • ${time} mins • ${labelRoutine(routineKey)}`;
    renderRoutinePreview(routineItems);
  }

  startBtn.disabled = false;
}

/* ==============================
   PREVIEW RENDERERS
   ============================== */
function renderPreview(chosen, presc, rest) {
  previewList.innerHTML = "";
  chosen.forEach((ex, idx) => {
    const row = document.createElement("div");
    row.className = "preview-item";
    row.innerHTML = `
      <div class="name">${idx + 1}. ${escapeHtml(ex.name)}</div>
      <div class="prescription">${escapeHtml(presc)} • Rest ${rest}s</div>
    `;
    previewList.appendChild(row);
  });
}

function renderRoutinePreview(items) {
  previewList.innerHTML = "";
  items.forEach((name, idx) => {
    const row = document.createElement("div");
    row.className = "preview-item";
    row.innerHTML = `
      <div class="name">${idx + 1}. ${escapeHtml(name)}</div>
      <div class="prescription">Move slow • breathe</div>
    `;
    previewList.appendChild(row);
  });
}

/* ==============================
   WORKOUT MODE (FULL SCREEN)
   ============================== */
function startWorkout() {
  if (!workout.length) return;

  clearTimer();
  stepIndex = 0;

  workoutScreen.classList.remove("hidden");
  workoutScreen.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  renderStep();
}

function exitWorkout() {
  clearTimer();

  workoutScreen.classList.add("hidden");
  workoutScreen.setAttribute("aria-hidden", "true");
  workoutCard.innerHTML = "";
  document.body.style.overflow = "";

  updateProgress();
}

function skipCurrentStep() {
  // Skip only non-critical steps; still allow skipping anything if user wants
  clearTimer();
  stepIndex++;
  renderStep();
}

/* ==============================
   STEP RENDERING
   ============================== */
function renderStep() {
  clearTimer();
  updateProgress();

  const step = workout[stepIndex];
  if (!step) return;

  // Update mode text + skip label logic
  modeText.textContent = modeLabel(step.type);
  skipStepBtn.textContent = step.type === "finish" ? "Close" : "Skip";

  if (step.type === "block") return renderBlock(step);
  if (step.type === "coach") return renderCoach(step);
  if (step.type === "timer") return renderTimerStep(step);
  if (step.type === "reps") return renderRepsStep(step);
  if (step.type === "exercise") return renderExercise(step);
  if (step.type === "rest") return renderRest(step.seconds);
  return renderFinish();
}

function renderBlock(step) {
  workoutCard.innerHTML = `
    <div class="card">
      <h3>${escapeHtml(step.title)}</h3>
      <p class="sub">${escapeHtml(step.subtitle || "")}</p>
      <div class="hintline">Tap to continue</div>
    </div>
  `;
  workoutCard.onclick = nextStep;
}

function renderCoach(step) {
  workoutCard.innerHTML = `
    <div class="card">
      <h3>${escapeHtml(step.title)}</h3>
      <p class="sub">${escapeHtml(step.subtitle || "")}</p>
      ${bulletsBox("Notes", step.bullets || [])}
      <div class="hintline">Tap to continue</div>
    </div>
  `;
  workoutCard.onclick = nextStep;
}

function renderTimerStep(step) {
  let remaining = Number(step.seconds) || 60;

  workoutCard.innerHTML = `
    <div class="card">
      <h3>${escapeHtml(step.title)}</h3>
      <p class="sub">${escapeHtml(step.subtitle || "")}</p>
      <div class="big" id="countNum">${remaining}</div>
      ${step.bullets?.length ? bulletsBox("Do this", step.bullets) : ""}
      <div class="hintline">Tap to skip • Auto-advance at 0</div>
    </div>
  `;

  const countNum = document.getElementById("countNum");
  workoutCard.onclick = nextStep;

  timer = setInterval(() => {
    remaining--;
    if (countNum) countNum.textContent = String(remaining);
    if (remaining <= 0) nextStep();
  }, 1000);
}

function renderRepsStep(step) {
  workoutCard.innerHTML = `
    <div class="card">
      <h3>${escapeHtml(step.title)}</h3>
      <p class="sub">${escapeHtml(step.subtitle || "")}</p>
      ${step.reps ? `<div class="pills"><div class="pill">${escapeHtml(step.reps)}</div></div>` : ""}
      ${step.bullets?.length ? bulletsBox("Do this", step.bullets) : ""}
      <div class="hintline">Tap Done to continue</div>
      <div class="pills"><div class="pill">Tap anywhere = Done</div></div>
    </div>
  `;
  workoutCard.onclick = nextStep;
}

function renderExercise(step) {
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

  workoutCard.onclick = nextStep;
}

function renderRest(seconds) {
  let remaining = Number(seconds) || 45;

  workoutCard.innerHTML = `
    <div class="card">
      <h3>REST</h3>
      <div class="big" id="restNum">${remaining}</div>
      <p class="sub">Tap to skip</p>
      <div class="pills">
        <div class="pill">Auto-advance at 0</div>
      </div>
    </div>
  `;

  const restNum = document.getElementById("restNum");
  workoutCard.onclick = nextStep;

  timer = setInterval(() => {
    remaining--;
    if (restNum) restNum.textContent = String(remaining);
    if (remaining <= 0) nextStep();
  }, 1000);
}

function renderFinish() {
  workoutCard.innerHTML = `
    <div class="card">
      <h3>SESSION COMPLETE</h3>
      <p class="sub">Tap Exit to return</p>
      <div class="pills">
        <div class="pill">Nice work</div>
        <div class="pill">Recover well</div>
      </div>
    </div>
  `;
  workoutCard.onclick = null;
}

/* ==============================
   PROGRESS
   ============================== */
function updateProgress() {
  const total = workout.length || 0;
  const current = Math.min(stepIndex + 1, total);

  progressText.textContent = `${current} / ${total}`;
  const pct = total ? Math.round(((current - 1) / total) * 100) : 0;
  progressFill.style.width = `${clamp(pct, 0, 100)}%`;
}

/* ==============================
   HELPERS
   ============================== */
function nextStep() {
  clearTimer();
  stepIndex++;
  if (stepIndex >= workout.length) stepIndex = workout.length - 1;
  renderStep();
}

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function labelEquipment(e) {
  if (e === "dumbbells") return "Dumbbells only";
  if (e === "fullgym") return "Full gym";
  if (e === "sandbag") return "Sandbag";
  if (e === "kettlebell") return "Kettlebell";
  return e;
}

function labelRoutine(r) {
  if (r === "fullbody") return "Full body";
  if (r === "hips") return "Hips";
  if (r === "shoulders") return "Shoulders";
  if (r === "tspine") return "T‑spine";
  if (r === "postrun") return "Post‑run";
  return "Auto";
}

function modeLabel(type) {
  if (type === "timer" || type === "reps" || type === "block") return "Warm‑up / Routine";
  if (type === "exercise") return "Work";
  if (type === "rest") return "Rest";
  if (type === "coach") return "Coach";
  if (type === "finish") return "Complete";
  return "Session";
}

function cuesForExercise(ex) {
  // Choose 2 cues max based on tags
  const tags = ex.tags || [];
  const cues = [];

  for (const t of tags) {
    const pool = CUES_BY_TAG[t];
    if (pool && pool.length) cues.push(pool[0]);
    if (cues.length >= 2) break;
  }

  // If none matched, provide generic
  if (!cues.length) return ["Move with control and clean positions.", "Stop the set if form breaks."];

  // Remove duplicates
  return Array.from(new Set(cues)).slice(0, 2);
}

function bulletsBox(title, bullets) {
  const items = (bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("");
  return `
    <div class="noteBox">
      <strong>${escapeHtml(title)}</strong>
      <ul>${items}</ul>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
