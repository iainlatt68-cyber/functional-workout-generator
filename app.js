console.log("✅ JS running");

let workout = [];
let index = 0;
let timer = null;

const EXERCISES = {
  kettlebell: ["Swing", "Goblet Squat", "Clean & Press"],
  sandbag: ["Clean", "Bear Hug Squat", "Carry"],
  bodyweight: ["Press‑Up", "Air Squat", "Plank"]
};
const state = {
  goal: "hypertrophy",
  difficulty: "intermediate",
  equipment: "fullgym",
  time: 30
};
const RESTS = {
  strength: 90,
  conditioning: 45,
  hybrid: 60
};

const $ = id => document.getElementById(id);

$("generate").onclick = generate;
$("start").onclick = start;

function generate() {
  workout = [];
  index = 0;

  const goal = $("goal").value;
  const difficulty = $("difficulty").value;
  const count = Number($("count").value);
  const equipment = Array.from($("equipment").selectedOptions).map(o => o.value);

  equipment.forEach(eq => {
    shuffle(EXERCISES[eq]);
    EXERCISES[eq].slice(0, count).forEach(name => {
      workout.push({
        name: `${eq}: ${name}`,
        rest: adjustRest(RESTS[goal], difficulty)
      });
    });
  });

  renderPreview();
  $("start").disabled = workout.length === 0;
}

function renderPreview() {
  $("preview").innerHTML = workout.map((w, i) =>
    `<div>${i + 1}. ${w.name}</div>`
  ).join("");
}

function start() {
  $("workoutScreen").classList.remove("hidden");
  index = 0;
  showExercise();
}

function showExercise() {
  clearTimer();

  if (index >= workout.length) {
    finish();
    return;
  }

  const ex = workout[index];

  $("workoutScreen").innerHTML = `
    <h2>${ex.name}</h2>
    <div class="hint">Tap to start rest</div>
  `;

  $("workoutScreen").onclick = () => startRest(ex.rest);
}

function startRest(seconds) {
  let remaining = seconds;

  $("workoutScreen").onclick = null;
  $("workoutScreen").innerHTML = `
    <h2>REST</h2>
    <div class="timer" id="t">${remaining}</div>
    <div class="hint">Tap to skip</div>
  `;

  $("workoutScreen").onclick = next;

  timer = setInterval(() => {
    remaining--;
    $("t").textContent = remaining;
    if (remaining <= 0) next();
  }, 1000);
}

function next() {
  clearTimer();
  index++;
  showExercise();
}

function finish() {
  $("workoutScreen").innerHTML = `
    <h2>SESSION COMPLETE</h2>
    <button id="exit">Back</button>
  `;
  $("exit").onclick = () => {
    $("workoutScreen").classList.add("hidden");
    $("start").disabled = true;
  };
}

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function adjustRest(base, diff) {
  return diff === "easy" ? base - 15 :
         diff === "hard" ? base + 15 : base;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}
