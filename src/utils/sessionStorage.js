const SESSIONS_KEY = "flowtain.focus.sessions";
const HOURLY_RATE_KEY = "flowtain.hourlyRate";
const SESSIONS_UPDATED_EVENT = "flowtain:sessions-updated";
const RATE_UPDATED_EVENT = "flowtain:hourly-rate-updated";

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function dispatchEvent(name) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name));
}

export function getStoredSessions() {
  const sessions = readJson(SESSIONS_KEY, []);
  return Array.isArray(sessions) ? sessions : [];
}

export function saveFocusSession(session) {
  const sessions = getStoredSessions();
  writeJson(SESSIONS_KEY, [...sessions, session]);
  dispatchEvent(SESSIONS_UPDATED_EVENT);
}

export function subscribeToSessions(callback) {
  if (typeof window === "undefined") return () => {};

  const handleUpdate = () => callback(getStoredSessions());
  const handleStorage = (event) => {
    if (event.key === SESSIONS_KEY) {
      callback(getStoredSessions());
    }
  };

  window.addEventListener(SESSIONS_UPDATED_EVENT, handleUpdate);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(SESSIONS_UPDATED_EVENT, handleUpdate);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getHourlyRate() {
  const stored = readJson(HOURLY_RATE_KEY, 0);
  return Number.isFinite(Number(stored)) ? Number(stored) : 0;
}

export function saveHourlyRate(rate) {
  const safeRate = Number.isFinite(Number(rate)) ? Number(rate) : 0;
  writeJson(HOURLY_RATE_KEY, safeRate);
  dispatchEvent(RATE_UPDATED_EVENT);
}

export function subscribeToHourlyRate(callback) {
  if (typeof window === "undefined") return () => {};

  const handleUpdate = () => callback(getHourlyRate());
  const handleStorage = (event) => {
    if (event.key === HOURLY_RATE_KEY) {
      callback(getHourlyRate());
    }
  };

  window.addEventListener(RATE_UPDATED_EVENT, handleUpdate);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(RATE_UPDATED_EVENT, handleUpdate);
    window.removeEventListener("storage", handleStorage);
  };
}
