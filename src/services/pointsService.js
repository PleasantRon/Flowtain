/** Points economy + levels + streak rules (pure). */

export const POINTS_FOCUS_SESSION = 10;
export const POINTS_TASK_COMPLETE = 20;

/** Level thresholds: level N requires `min` cumulative points. */
export const LEVEL_LADDER = [
  { level: 1, min: 0, title: "Initiate", label: "Level 1: Initiate" },
  { level: 2, min: 100, title: "Locked In", label: "Level 2: Locked In" },
  { level: 3, min: 250, title: "Deep Worker 🧠", label: "Level 3: Deep Worker 🧠" },
  { level: 4, min: 450, title: "Flow State", label: "Level 4: Flow State" },
  { level: 5, min: 700, title: "Precision Engine", label: "Level 5: Precision Engine" },
  { level: 6, min: 1000, title: "Iron Focus", label: "Level 6: Iron Focus" },
  { level: 7, min: 1400, title: "Unstoppable", label: "Level 7: Unstoppable" },
  { level: 8, min: 1900, title: "Ascendant", label: "Level 8: Ascendant" },
  { level: 9, min: 2500, title: "Sovereign", label: "Level 9: Sovereign" },
  { level: 10, min: 3200, title: "Flowtain Prime", label: "Level 10: Flowtain Prime" },
];

/**
 * @param {number} points
 */
export function getLevelInfo(points) {
  const p = Math.max(0, points);
  let current = LEVEL_LADDER[0];
  for (const row of LEVEL_LADDER) {
    if (p >= row.min) current = row;
  }
  const idx = LEVEL_LADDER.indexOf(current);
  const next = LEVEL_LADDER[idx + 1];
  return {
    level: current.level,
    title: current.title,
    label: current.label,
    min: current.min,
    nextLevelMin: next?.min ?? null,
    progressToNext: next ? Math.min(1, (p - current.min) / (next.min - current.min)) : 1,
  };
}

/**
 * @param {number} pointsBefore
 * @param {number} pointsAfter
 */
export function didLevelUp(pointsBefore, pointsAfter) {
  const before = getLevelInfo(pointsBefore);
  const after = getLevelInfo(pointsAfter);
  return after.level > before.level ? after : null;
}

/**
 * Calendar-day streak: bump when user completes a focus session today.
 * @param {{ streak: number; lastLockInDate: string | null }} progress
 * @param {Date} [now]
 */
export function nextStreakAfterSession(progress, now = new Date()) {
  const today = toDayKey(now);
  const last = progress.lastLockInDate;

  if (!last) {
    return { streak: 1, lastLockInDate: today };
  }

  if (last === today) {
    return { streak: progress.streak, lastLockInDate: today };
  }

  const yesterday = toDayKey(addDays(now, -1));
  if (last === yesterday) {
    return { streak: progress.streak + 1, lastLockInDate: today };
  }

  return { streak: 1, lastLockInDate: today };
}

function toDayKey(d) {
  return d.toISOString().slice(0, 10);
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
