import { createId } from "../utils/id.js";

const KEY = "flowtain-workspace-v1";
const LEGACY_KEY = "flowline-app-state-v1";

const defaultSettings = () => ({
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  soundEnabled: true,
});

export function createEmptyWorkspace() {
  return {
    tasks: [],
    focusSessions: [],
    settings: defaultSettings(),
  };
}

/**
 * @returns {import('../context/TaskContext.jsx').WorkspaceState}
 */
export function loadWorkspace() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return normalizeWorkspace(parsed);
    }
  } catch {
    /* fall through */
  }

  try {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      const migrated = normalizeWorkspace({
        tasks: parsed.tasks,
        focusSessions: parsed.focusSessions,
        settings: parsed.settings
          ? {
              workMinutes: parsed.settings.workMinutes,
              shortBreakMinutes: parsed.settings.shortBreakMinutes,
              longBreakMinutes: parsed.settings.longBreakMinutes,
              soundEnabled: parsed.settings.soundEnabled,
            }
          : undefined,
      });
      saveWorkspace(migrated);
      return migrated;
    }
  } catch {
    /* ignore */
  }

  return createEmptyWorkspace();
}

export function saveWorkspace(workspace) {
  try {
    localStorage.setItem(KEY, JSON.stringify(workspace));
  } catch {
    /* ignore */
  }
}

export function clearWorkspace() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

function normalizeWorkspace(partial) {
  const base = createEmptyWorkspace();
  if (!partial || typeof partial !== "object") return base;
  return {
    tasks: Array.isArray(partial.tasks) ? partial.tasks : base.tasks,
    focusSessions: Array.isArray(partial.focusSessions) ? partial.focusSessions : base.focusSessions,
    settings: { ...base.settings, ...(partial.settings && typeof partial.settings === "object" ? partial.settings : {}) },
  };
}

/** @param {string} title */
export function buildTaskRecord(title) {
  return {
    id: createId(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}
