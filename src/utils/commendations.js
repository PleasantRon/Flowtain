/** Dynamic commendations — confident, minimal, slightly intense. */

const SESSION_COMPLETE = [
  "🔥 You're on fire.",
  "Locked in. That's Flowtain.",
  "Focus level rising 📈",
  "Another session conquered.",
  "Consistency is your superpower.",
  "You showed up. That's the difference.",
  "Depth over noise. Again.",
];

const TASK_COMPLETE = [
  "Cleared. Next.",
  "That's one less thing in your head.",
  "Execution > intention. You proved it.",
  "Sharp. Keep the blade moving.",
  "Momentum is built like this.",
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function commendationForSessionComplete() {
  return pick(SESSION_COMPLETE);
}

export function commendationForTaskComplete() {
  return pick(TASK_COMPLETE);
}
