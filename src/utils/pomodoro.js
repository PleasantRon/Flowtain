/** Derive initial seconds for a timer mode from settings (minutes). */
export function secondsForMode(mode, settings) {
  switch (mode) {
    case "work":
      return Math.max(1, settings.workMinutes) * 60;
    case "shortBreak":
      return Math.max(1, settings.shortBreakMinutes) * 60;
    case "longBreak":
      return Math.max(1, settings.longBreakMinutes) * 60;
    default:
      return settings.workMinutes * 60;
  }
}

export function nextModeAfterBreak() {
  return "work";
}
