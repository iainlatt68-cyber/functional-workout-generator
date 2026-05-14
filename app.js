/* --- Base --- */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: radial-gradient(1200px 600px at 50% -200px, #1e293b, #020617);
  color: #e5e7eb;
}

.app {
  max-width: 520px;
  margin: auto;
  padding: 16px;
}

/* --- Controls --- */
.control-group { margin-bottom: 14px; }
.label {
  font-size: 12px;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 6px;
}
.button-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.button-row button {
  flex: 1 1 45%;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #334155;
  background: #020617;
  color: #e5e7eb;
}
.button-row button.active {
  background: linear-gradient(180deg,#2563eb,#1d4ed8);
  border-color: transparent;
}

/* --- Workout Card --- */
.workout-card {
  background: rgba(2,6,23,.9);
  border-radius: 22px;
  padding: 22px;
  border: 1px solid #334155;
}

.current-exercise {
  font-size: 22px;
  font-weight: 900;
  text-align: center;
  padding: 18px;
  border-radius: 18px;
  background: #020617;
  border: 1px solid #2563eb;
  margin: 12px 0;
}

/* --- Pattern Tags --- */
.pattern-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}
.pattern-squat { background:#2563eb; }
.pattern-hinge { background:#7c3aed; }
.pattern-push  { background:#059669; }
.pattern-pull  { background:#d97706; }

/* --- Warmup --- */
.warmup-list li {
  list-style:none;
  padding:10px;
  border:1px solid #334155;
  border-radius:10px;
  margin-bottom:6px;
}
.warmup-list li.done { opacity:.5; text-decoration:line-through; }

/* --- Buttons --- */
.big-action {
  width:100%;
  padding:18px;
  border-radius:18px;
  background:linear-gradient(180deg,#2563eb,#1d4ed8);
  border:none;
  color:white;
  font-size:18px;
}

/* --- End Screen --- */
.session-complete {
  text-align:center;
  padding:60px 20px;
}
