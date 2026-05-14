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
    btn.addEventListener("click", () => {

      // Multi-select (addons)
      if (key === "addons") {
        btn.classList.toggle("active");
        const v = btn.dataset.value;
        controlState.addons.includes(v)
          ? controlState.addons.splice(controlState.addons.indexOf(v), 1)
          : controlState.addons.push(v);
        return;
      }

      // Single select
      row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      controlState[key] = btn.dataset.value;

      // Show / hide addon equipment
      if (key === "equipment") {
        document
          .getElementById("addons")
          .classList.toggle("hidden", btn.dataset.value !== "minimal");
      }
    });
  });
});

// You now read `controlState` inside Generate
