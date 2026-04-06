export function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function labelForTimerMode(mode) {
  if (mode === "work") return "Focus";
  if (mode === "shortBreak") return "Short break";
  return "Long break";
}

export function phaseProgressPercent(secondsLeft, phaseDurationSeconds) {
  if (phaseDurationSeconds <= 0) return 0;
  return Math.min(100, Math.round((1 - secondsLeft / phaseDurationSeconds) * 100));
}
