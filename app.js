document.addEventListener("DOMContentLoaded", () => {

  const state = {
    goal: "hypertrophy",
    equipment: "fullgym",
    time: 30,
    condMode: "zone2",
    cardioPlacement: "end"
  };

  let workout = [];
  let stepIndex = 0;
  let exerciseIndex = 0;

  const EXERCISES = {
    fullgym: {
      squat: ["Back Squat","Front Squat","Goblet Squat"],
      hinge: ["Deadlift","Romanian Deadlift"],
      push: ["Bench Press","Overhead Press","Push-ups"],
      pull: ["Barbell Row","Pull-ups","Lat Pulldown"]
    }
  };

  const ZONE2 = [
    { name:"Exercise Bike", cue:"Steady cadence. Full sentences." },
    { name:"Rower", cue:"18–22 spm. Relaxed strokes." },
    { name:"Crosstrainer", cue:"Smooth continuous pace." },
    { name:"Treadmill Incline Walk", cue:"5–10% incline. Brisk walk." }
  ];

  const COACHING = {
    strength:["Quality reps over load","Rest fully between sets"],
    conditioning:["Repeatable pace","Do not redline"],
    zone2:["If breathing strains, slow down","This should feel sustainable"]
  };

  document.querySelectorAll(".button-row").forEach(row=>{
    const g=row.dataset.group;
    row.querySelectorAll("button").forEach(b=>{
      b.onclick=()=>{
        row.querySelectorAll(x=>x.classList.remove("active"));
        b.classList.add("active");
        state[g]=g==="time"?Number(b.dataset.value):b.dataset.value;
      };
    });
  });

  const preview=document.getElementById("preview");
  const startBtn=document.getElementById("start");
  const workoutCard=document.getElementById("workoutCard");

  document.getElementById("generate").onclick=()=>{
    workout=buildWorkout();
    preview.innerHTML=workout.map(w=>`<div>${w.label}</div>`).join("");
    startBtn.disabled=false;
  };

  startBtn.onclick=()=>{stepIndex=0;exerciseIndex=0;renderStep();};

  function renderStep(){
    if(stepIndex>=workout.length){
      workoutCard.innerHTML=`<div class="session-complete"><h1>SESSION COMPLETE</h1></div>`;
      return;
    }
    const step=workout[stepIndex];

    if(step.type==="warmup"){
      workoutCard.innerHTML=`
        <h2>Warm-up</h2>
        <ul class="warmup-list">
          ${step.items.map(i=>`<li>${i}</li>`).join("")}
        </ul>
        <button class="big-action" id="next">Begin</button>`;
      workoutCard.querySelectorAll("li").forEach(li=>li.onclick=()=>li.classList.toggle("done"));
      document.getElementById("next").onclick=()=>{stepIndex++;renderStep();};
      return;
    }

    if(step.type==="round"){
      const ex=step.exercises[exerciseIndex];
      const pat=step.patterns[exerciseIndex];
      workoutCard.innerHTML=`
        <span class="pattern-tag pattern-${pat}">${pat}</span>
        <div class="current-exercise">${ex}</div>
        <p>${step.prescription}</p>
        <ul>${step.cues.map(c=>`<li>${c}</li>`).join("")}</ul>
        <button class="big-action" id="done">Done</button>`;
      document.getElementById("done").onclick=()=>{
        exerciseIndex++;
        if(exerciseIndex>=step.exercises.length){exerciseIndex=0;stepIndex++;}
        renderStep();
      };
      return;
    }

    if(step.type==="zone2"){
      workoutCard.innerHTML=`
        <h2>Zone 2 Conditioning</h2>
        <div class="current-exercise">${step.activity}</div>
        <p>${step.detail}</p>
        <ul>
          <li>${step.cue}</li>
          ${COACHING.zone2.map(c=>`<li>${c}</li>`).join("")}
        </ul>
        <button class="big-action" id="next">Finish</button>`;
      document.getElementById("next").onclick=()=>{stepIndex++;renderStep();};
      return;
    }
  }

  function buildWorkout(){
    const out=[];
    out.push({type:"warmup",label:"Warm-up",items:[
      "Pulse raise 2–3 mins",
      "Hip & shoulder mobility",
      "Cat–cow",
      "World’s greatest stretch",
      "Ramp-up sets"
    ]});

    if(state.goal!=="conditioning"){
      const patterns=["squat","hinge","push","pull"];
      for(let r=1;r<=3;r++){
        out.push({
          type:"round",
          label:`Round ${r}`,
          patterns,
          exercises:patterns.map(p=>EXERCISES.fullgym[p][0]),
          prescription:"3–5 reps (strength) or 8–12 reps (hypertrophy)",
          cues:COACHING[state.goal]
        });
      }
      const z=ZONE2[Math.floor(Math.random()*ZONE2.length)];
      out.push({type:"zone2",label:"Zone 2",activity:z.name,detail:"20–30 mins • RPE 4–5",cue:z.cue});
    }
    return out;
  }
});
``
