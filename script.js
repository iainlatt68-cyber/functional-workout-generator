
const exercises = {

    power: [
        "Broad Jump",
        "Push Press",
        "Sprint"
    ],

    squat: [
        "Front Squat",
        "Goblet Squat",
        "Bulgarian Split Squat",
        "Step-Up"
    ],

    hinge: [
        "Romanian Deadlift",
        "Deadlift",
        "Kettlebell Swing",
      
    ],

    push: [
        "Push-Up",
        "Bench Press",
        "Overhead Press",
        "Dumbbell Press"
    ],

    pull: [
        "Bent-Over Row",
        "Lat Pulldown"
    ],

    carry: [
        "Farmer Carry",
        "Suitcase Carry",
        "Front Rack Carry"
    ],

    core: [
        "Pallof Press",
        "Dead Bug",
        "Hanging Knee Raise",
        "Plank"
    ],

    conditioning: [
        "Zone 2 Run",
        "Rowing",
        "Bike Intervals",
        "Circuit Training"
    ],

    mobility: [
        "90/90 Hip Switch",
        "World's Greatest Stretch",
        "Thoracic Rotation",
        "Couch Stretch"
    ]
};

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateSetsReps(category) {

    if (category === "power") {
        return `${Math.floor(Math.random() * 3) + 3} sets x ${Math.floor(Math.random() * 3) + 3} reps`;
    }

    if (["squat", "hinge", "push", "pull"].includes(category)) {
        const reps = [5, 6, 8, 10];
        return `${Math.floor(Math.random() * 3) + 3} sets x ${randomItem(reps)} reps`;
    }

    if (category === "carry") {
        return `${Math.floor(Math.random() * 3) + 3} rounds x ${Math.floor(Math.random() * 40) + 20} sec`;
    }

    if (category === "core") {
        return `${Math.floor(Math.random() * 2) + 3} sets x ${Math.floor(Math.random() * 10) + 10} reps`;
    }

    if (category === "conditioning") {
        return randomItem([
            "20 min Zone 2",
            "10 x 1 min hard / 1 min easy",
            "15 min continuous",
            "5 rounds x 2 min work"
        ]);
    }

    if (category === "mobility") {
        return `${Math.floor(Math.random() * 2) + 2} sets x ${Math.floor(Math.random() * 30) + 30} sec`;
    }

    return "3 x 10";
}

function createWorkoutCard(category, exercise, prescription) {

    return `
        <div class="workout-card">
            <div class="category">${category.toUpperCase()}</div>
            <div class="exercise">${exercise}</div>
            <div class="prescription">${prescription}</div>
        </div>
    `;
}

function generateWorkout() {
  const level = document.getElementById("level").value;
const duration = document.getElementById("duration").value;
const equipment = document.getElementById("equipment").value;

console.log(level, duration, equipment);
    }
    let workoutHTML = "";

    for (const category in exercises) {

        const exercise = randomItem(exercises[category]);
        const prescription = generateSetsReps(category);

        workoutHTML += createWorkoutCard(
            category,
            exercise,
            prescription
        );
      

    document.getElementById("workout").innerHTML = workoutHTML;
}
