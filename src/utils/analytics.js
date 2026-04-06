/** @typedef {{ id: string; at: string; durationSeconds: number; mode: 'work' }} FocusSession */

/**
 * @param {FocusSession[]} sessions
 * @param {number} days
 */
export function sessionsInLastDays(sessions, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return sessions.filter((s) => new Date(s.at).getTime() >= cutoff);
}

/**
 * Placeholder chart series: count of focus sessions per day for last `dayCount` days.
 * @param {FocusSession[]} sessions
 * @param {number} dayCount
 */
export function dailySessionCounts(sessions, dayCount) {
  const labels = [];
  const values = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = dayCount - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    labels.push(key);
    const count = sessions.filter((s) => s.at.slice(0, 10) === key).length;
    values.push(count);
  }

  return { labels, values };
}

/**
 * @param {FocusSession[]} sessions
 */
export function totalFocusMinutes(sessions) {
  const sec = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  return Math.round(sec / 60);
}

/**
 * @param {{ completed: boolean }[]} tasks
 */
export function taskCompletionRate(tasks) {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.completed).length;
  return Math.round((done / tasks.length) * 100);
}
