document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ App initialising");

  /* ======================
     STATE
     ====================== */
  const state = {
    goal: "hypertrophy",
    difficulty: "intermediate",
    equipment: "fullgym",
    time: 30
  };

  let workout = [];

  /* ======================
     DOM
     ====================== */
  const previewList = document.getElementById("previewList");
  const meta = document.getElementById("meta");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");

  /* ======================
     BUTTON STATE HANDLING
     ====================== */
  document.querySelectorAll(".button-row").forEach(row => {
    const group = row.dataset.group;

    row.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const value = btn.dataset.value;
        state[group] = group === "time" ? Number(value) : value;

        console.log("STATE:", { ...state });
      });
    });
  });

  /* ======================
     GENERATE WORKOUT
     ====================== */
  generateBtn.addEventListener("click", () => {
    workout = [];
    previewList.innerHTML = "";

    const pool = getExercisePool(state.equipment);
    const countByTime = {
      15: 4,
      30: 7,
      45: 10,
      60: 12,
      90: 16
    };

    const count = countByTime[state.time] ?? 7;

    shuffle(pool);
    const selected = pool.slice(0, count);

    selected.forEach((name, index) => {
      workout.push(name);

      const row = document.createElement("div");
      row.className = "preview-item";
      row.innerHTML = `
        <div class="name">${index + 1}. ${name}</div>
        <div class="prescription">${state.goal} / ${state.difficulty}</div>
      `;
      previewList.appendChild(row);
    });

    meta.textContent =
      `${state.goal.toUpperCase()} • ` +
      `${state.difficulty.toUpperCase()} • ` +
      `${labelEquipment(state.equipment)} • ` +
      `${state.time} mins`;

    startBtn.disabled = workout.length === 0;
  });

  /* ======================
     START WORKOUT (TEMP)
     ====================== */
  startBtn.addEventListener("click", () => {
    alert(`✅ WORKOUT STARTED\n\n${workout.join("\n")}`);
  });

  /* ======================
     HELPERS
     ====================== */
  function getExercisePool(equipment) {
    const pools = {
      dumbbells: [
        "DB Goblet Squat",
        "DB RDL",
        "DB Press",
        "DB Row",
        "Farmer Carry"
      ],
      kettlebell: [
        "KB Swing",
        "Goblet Squat",
        "KB Clean & Press",
        "KB Row"
      ],
      sandbag: [
        "Sandbag Clean",
        "Bear Hug Squat",
        "Sandbag Carry",
        "Sandbag Lunge"
      ],
      fullgym: [
        "Back Squat",
        "Deadlift",
        "Bench Press",
        "Row",
        "Overhead Press",
        "Lat Pulldown"
      ]
    };

    return [...(pools[equipment] || pools.fullgym)];
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
});
