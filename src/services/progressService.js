const KEY = "flowtain-progress-v1";

export function defaultProgress() {
  return {
    points: 0,
    streak: 0,
    lastLockInDate: null,
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress();
    const p = JSON.parse(raw);
    return {
      points: typeof p.points === "number" && p.points >= 0 ? p.points : 0,
      streak: typeof p.streak === "number" && p.streak >= 0 ? p.streak : 0,
      lastLockInDate: typeof p.lastLockInDate === "string" ? p.lastLockInDate : null,
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
