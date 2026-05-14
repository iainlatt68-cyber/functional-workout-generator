document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    equipment: "fullgym",
    difficulty: "moderate",
    rounds: 3,
    condMode: "zone2",
    cardioPlacement: "end"
  };

  let steps = [];
  let idx = 0;
  let timer = null;
  let timeRemaining = 0;
  let emomMinute = 1;

  const preview = document.getElementById("preview");
  const generateBtn = document.getElementById("generate");
  const startBtn = document.getElementById("start");
  const workoutScreen = document.getElementById("workoutScreen");
  const workoutCard = document.getElementById("workoutCard");
  const exitBtn = document.getElementById("exit");

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

  const EXERCISES = {
    fullgym: {
      squat: ["Back Squat","Front Squat"],
      hinge: ["Deadlift","Romanian Deadlift"],
      push: ["Bench Press","Overhead Press"],
      pull: ["Barbell Row","Pull‑ups"]
    },
    dumbbells: {
      squat: ["Goblet Squat"],
      hinge: ["DB RDL"],
      push: ["DB Press"],
      pull: ["DB Row"]
    },
    kettlebell: {
      squat: ["KB Goblet Squat"],
      hinge: ["KB Swing"],
      push: ["KB Push Press"],
      pull: ["KB Row"]
    },
    sandbag: {
      squat: ["Sandbag Squat"],
      hinge: ["Sandbag Deadlift"],
      push: ["Sandbag Push Press"],
      pull: ["Sandbag Row"]
    }
  };

  const CARDIO = [
    { name:"Bike", coach:"Smooth cadence, nasal breathing." },
    { name:"Row", coach:"18–22 spm, relaxed strokes." },
    { name:"Treadmill Incline Walk", coach:"Brisk walk, no jogging." },
    { name:"Cross‑trainer", coach:"Continuous, non‑spiky effort." }
  ];

  generateBtn.onclick = () => {
    steps = buildSteps();
    preview.innerHTML = steps.map((s,i) => `
      <div class="preview-card">
        <span class="preview-index">${i+1}</span>
        <div>
          <strong>${s.type.toUpperCase()}</strong>
          <div class="preview-text">${s.exercise || s.cardio || ""}</div>
        </div>
      </div>
    `).join("");
    startBtn.disabled = false;
  };

  startBtn.onclick = () => {
    workoutScreen.classList.remove("hidden");
    idx = 0;
    render();
  };

  exitBtn.onclick = () => {
    clearInterval(timer);
    workoutScreen.classList.add("hidden");
  };

  function render() {
    clearInterval(timer);

    if (idx >= steps.length) {
      showSummary();
      return;
    }

    const s = steps[idx];

    if (s.type === "strength") {
      workoutCard.innerHTML = `
        <div class="card">
          <span class="badge ${s.pattern}">${s.pattern}</span>
          <h2>${s.exercise}</h2>
          <p>${s.prescription}</p>
          <p class="coach-note">${s.coach}</p>

          <label style="display:block;margin-top:14px;font-size:13px;">
            Weight used (kg)
            <input id="weightInput" type="number"
              style="width:100%;padding:14px;margin-top:6px;border-radius:14px;
                     border:none;background:#020617;color:#e5e7eb;
                     font-size:20px;text-align:center;" />
          </label>

          <button class="big-action" id="saveNext">Save & Next</button>
        </div>`;
      document.getElementById("saveNext").onclick = () => {
        logExercise(s.exercise, Number(document.getElementById("weightInput").value)||0, s.reps);
        idx++; render();
      };
      return;
    }

    if (s.type === "zone2") {
      workoutCard.innerHTML = `
        <div class="card">
          <h2>Zone 2 — ${s.cardio}</h2>
          <p>${s.duration}</p>
          <p class="coach-note">${s.coach}</p>
          <button class="big-action" id="next">Finish</button>
        </div>`;
      document.getElementById("next").onclick = () => { idx++; render(); };
      return;
    }

    if (s.type === "emom") startEMOM(s);
    if (s.type === "amrap") startAMRAP(s);
  }

  function startEMOM(s) {
    emomMinute = 1;
    timeRemaining = 60;
    timer = setInterval(() => {
      workoutCard.innerHTML = `
        <div class="card">
          <h2>EMOM ${emomMinute}/${s.minutes}</h2>
          <p>${s.exercise}</p>
          <div class="timer">${timeRemaining}</div>
          <p class="coach-note">${s.coach}</p>
        </div>`;
      timeRemaining--;
      if (timeRemaining < 0) {
        emomMinute++; timeRemaining = 60;
        if (emomMinute > s.minutes) { clearInterval(timer); idx++; render(); }
      }
    },1000);
  }

  function startAMRAP(s) {
    timeRemaining = s.minutes * 60;
    timer = setInterval(() => {
      workoutCard.innerHTML = `
        <div class="card">
          <h2>AMRAP ${s.minutes} min</h2>
          <p>${s.exercises.join(" • ")}</p>
          <div class="timer">${timeRemaining}</div>
          <p class="coach-note">${s.coach}</p>
          <button class="big-action" id="finish">Finish</button>
        </div>`;
      document.getElementById("finish").onclick = () => { clearInterval(timer); idx++; render(); };
      timeRemaining--;
      if (timeRemaining < 0) { clearInterval(timer); idx++; render(); }
    },1000);
  }

  function buildSteps() {
    const out = [];
    const pool = EXERCISES[state.equipment];
    const patterns = ["squat","hinge","push","pull"];

    const strength = [];
    for (let r=1;r<=state.rounds;r++) {
      patterns.forEach(p => {
        const ex = pool[p][Math.floor(Math.random()*pool[p].length)];
        strength.push({
          type:"strength",
          pattern:p,
          exercise:ex,
          reps: state.goal==="strength"?5:10,
          prescription: state.goal==="strength"?"3–5 reps":"8–12 reps",
          coach:
            p==="squat"?"Brace first, then sit between hips.":
            p==="hinge"?"Push the floor away, keep lats tight.":
            p==="push"?"Ribs down, smooth lockout.":
            "Pull elbows to ribs."
        });
      });
    }

    const cardio = CARDIO[Math.floor(Math.random()*CARDIO.length)];
    const conditioning = buildConditioning(cardio);

    if (state.cardioPlacement==="start") out.push(conditioning,...strength);
    else out.push(...strength,conditioning);

    return out;
  }

  function buildConditioning(cardio) {
    if (state.condMode==="zone2") {
      return { type:"zone2", cardio:cardio.name, duration:"20–30 minutes", coach:cardio.coach };
    }
    if (state.condMode==="emom") {
      return { type:"emom", minutes:10, exercise:"12 Wall Balls", coach:"Finish early to earn rest." };
    }
    return { type:"amrap", minutes:12, exercises:["10 KB Swings","10 Push‑ups","10 Air Squats"], coach:"Smooth pace, no redlining." };
  }

  /* Logging & weekly load */
  function logExercise(name, weight, reps) {
    const logs = JSON.parse(localStorage.getItem("workoutLogs"))||[];
    let today = logs.find(l=>l.date===new Date().toISOString().slice(0,10));
    if (!today) {
      today={date:new Date().toISOString().slice(0,10),exercises:[],sessionLoad:0};
      logs.push(today);
    }
    today.exercises.push({name,weight,reps});
    today.sessionLoad += weight*reps;
    localStorage.setItem("workoutLogs",JSON.stringify(logs));
  }

  function showSummary() {
    const weekly = getWeeklyLoad();
    workoutCard.innerHTML = `
      <div class="card">
        <h1>SESSION COMPLETE</h1>
        <p><strong>Weekly load:</strong> ${weekly} kg</p>
        <p class="coach-note">${getRecommendation(weekly)}</p>
      </div>`;
  }

  function getWeeklyLoad() {
    const logs = JSON.parse(localStorage.getItem("workoutLogs"))||[];
    const now = new Date();
    return logs.filter(l=>(now-new Date(l.date))/86400000<=7)
               .reduce((s,l)=>s+l.sessionLoad,0);
  }

  function getRecommendation(load) {
    if (load<5000) return "Good start. Build gradually.";
    if (load<8000) return "✅ Sensible progression range.";
    if (load<10000) return "⚠️ Monitor fatigue.";
    return "🔴 Consider holding load steady next week.";
  }

  /* Onboarding — expert panel */
  if (!localStorage.getItem("onboardingSeen")) {
    const modal=document.getElementById("onboarding");
    const steps=[
      ["How workouts are built","Prepare → Train → Condition → Recover"],
      ["Strength first","Quality reps before fatigue."],
      ["Zone 2 matters","Build your aerobic base."],
      ["Repeatability","Finish worked, not wrecked."]
    ];
    let i=0;
    modal.classList.remove("hidden");
    document.getElementById("onboard-next").onclick=()=>{
      i++;
      if(i>=steps.length){
        modal.classList.add("hidden");
        localStorage.setItem("onboardingSeen","true");
      } else {
        document.getElementById("onboard-title").textContent=steps[i][0];
        document.getElementById("onboard-text").textContent=steps[i][1];
      }
    };
    document.getElementById("onboard-skip").onclick=
      document.getElementById("onboard-next").onclick;
    document.getElementById("onboard-title").textContent=steps[0][0];
    document.getElementById("onboard-text").textContent=steps[0][1];
  }

});
