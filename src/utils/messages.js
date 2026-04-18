/** Canonical Flowtain UX copy (identity + intensity). */

export const MESSAGES = {
  loginTitle: "Enter Flowtain",
  loginSubtitle: "Lock In. Level Up. Stay Focused.",
  sessionStart: "You're in Flowtain — focus mode engaged.",
  sessionComplete: "Locked in. Focus level rising. That's Flowtain.",
  pointsSession: "+10 points added",
  taskComplete: "Task eliminated. +20 points. You're moving different today.",
  levelUp: (level, title) => `Congratulations! Level ${level}: ${title}`,
  streak: (days) => `${days} days locked in. Keep the streak alive!`,
  dashboardGreeting: (name) => `Welcome back, ${name} 👋 Ready to lock in?`,
  resetConfirm: "Reset all workspace data on this device? Tasks, sessions, timer, and progress will clear.",
};
