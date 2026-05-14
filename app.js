const controlState = {
  goal: "strength",
  equipment: "gym",
  addons: [],
  duration: 45,
  effort: "moderate",
  conditioning: "easy",
  placement: "after"
};

document.querySelectorAll(".option-row").forEach(row => {
  const key = row.dataset.key;
  row.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {

      if (key === "addons") {
        btn.classList.toggle("active");
        const val = btn.dataset.value;
        controlState.addons.includes(val)
          ? controlState.addons.splice(controlState.addons.indexOf(val), 1)
          : controlState.addons.push(val);
        return;
      }

      row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      controlState[key] = btn.dataset.value;

      if (key === "equipment") {
        document.getElementById("addons")
          .classList.toggle("hidden", btn.dataset.value !== "minimal");
     
