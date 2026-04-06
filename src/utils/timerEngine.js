import { createId } from "./id.js";
import { nextModeAfterBreak, secondsForMode } from "./pomodoro.js";

export function createInitialTimer(settings) {
  const mode = "work";
  const nextSeconds = secondsForMode(mode, settings);
  return {
    mode,
    secondsLeft: nextSeconds,
    phaseDurationSeconds: nextSeconds,
    isRunning: false,
    sessionsUntilLongBreak: 4,
  };
}

/**
 * @param {object} timer
 * @param {object} settings
 * @returns {{ timer: object; sessionToAppend: object | null }}
 */
export function tickTimer(timer, settings) {
  if (!timer.isRunning) return { timer, sessionToAppend: null };
  if (timer.secondsLeft > 1) {
    return { timer: { ...timer, secondsLeft: timer.secondsLeft - 1 }, sessionToAppend: null };
  }
  return finishPhase(timer, settings);
}

/**
 * @param {object} timer
 * @param {object} settings
 */
export function finishPhase(timer, settings) {
  const { mode, phaseDurationSeconds, sessionsUntilLongBreak } = timer;

  if (mode === "work") {
    const sessionToAppend = {
      id: createId(),
      at: new Date().toISOString(),
      durationSeconds: phaseDurationSeconds,
      mode: "work",
    };
    const nextSessionsLeft = sessionsUntilLongBreak <= 1 ? 4 : sessionsUntilLongBreak - 1;
    const nextMode = sessionsUntilLongBreak <= 1 ? "longBreak" : "shortBreak";
    const nextSeconds = secondsForMode(nextMode, settings);
    return {
      timer: {
        ...timer,
        mode: nextMode,
        secondsLeft: nextSeconds,
        phaseDurationSeconds: nextSeconds,
        isRunning: false,
        sessionsUntilLongBreak: nextSessionsLeft,
      },
      sessionToAppend,
    };
  }

  if (mode === "shortBreak" || mode === "longBreak") {
    const nextMode = nextModeAfterBreak();
    const nextSeconds = secondsForMode(nextMode, settings);
    return {
      timer: {
        ...timer,
        mode: nextMode,
        secondsLeft: nextSeconds,
        phaseDurationSeconds: nextSeconds,
        isRunning: false,
      },
      sessionToAppend: null,
    };
  }

  return { timer, sessionToAppend: null };
}

/**
 * @param {object} settings
 */
export function resetTimer(settings) {
  return createInitialTimer(settings);
}

/**
 * Apply new settings to timer when paused (match prior app behavior).
 * @param {object} timer
 * @param {object} settings
 */
export function alignTimerToSettings(timer, settings) {
  if (timer.isRunning) return timer;
  const sec = secondsForMode(timer.mode, settings);
  return { ...timer, secondsLeft: sec, phaseDurationSeconds: sec };
}
