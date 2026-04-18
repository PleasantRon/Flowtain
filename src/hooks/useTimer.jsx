import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTaskWorkspace } from "../context/TaskContext.jsx";
import { usePoints } from "./usePoints.jsx";
import { useFlowFeedback } from "./useFlowFeedback.jsx";
import { MESSAGES } from "../utils/messages.js";
import { disposeSounds, playBell, playReset, playStart, startAmbient, stopAmbient } from "../utils/sounds.js";
import {
  alignTimerToSettings,
  createInitialTimer,
  finishPhase,
  resetTimer,
  tickTimer,
} from "../utils/timerEngine.js";

const TimerContext = createContext(null);

export function TimerProvider({ children }) {
  const { settings, appendFocusSession, resetClockSignal } = useTaskWorkspace();
  const { awardFocusSession } = usePoints();
  const { push } = useFlowFeedback();

  const [timer, setTimer] = useState(() => createInitialTimer(settings));
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const { workMinutes, shortBreakMinutes, longBreakMinutes, soundEnabled } = settings;

  useEffect(() => {
    setTimer((prev) => alignTimerToSettings(prev, settings));
  }, [workMinutes, shortBreakMinutes, longBreakMinutes, settings]);

  useEffect(() => {
    if (resetClockSignal === 0) return;
    setTimer(createInitialTimer(settingsRef.current));
  }, [resetClockSignal]);

  useEffect(() => {
    if (!timer.isRunning) return undefined;
    const id = window.setInterval(() => {
      setTimer((prev) => {
        if (prev.secondsLeft <= 1) {
          stopAmbient();
          if (settingsRef.current.soundEnabled) {
            playBell();
          }
        }
        const { timer: next, sessionToAppend } = tickTimer(prev, settingsRef.current);
        if (sessionToAppend) {
          appendFocusSession(sessionToAppend);
          queueMicrotask(() => {
            awardFocusSession();
          });
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timer.isRunning, appendFocusSession, awardFocusSession]);

  const isFocusActive = timer.isRunning && timer.mode === "work";

  useEffect(() => {
    if (soundEnabled && isFocusActive) {
      startAmbient();
      return undefined;
    }

    stopAmbient();
    return undefined;
  }, [soundEnabled, isFocusActive]);

  useEffect(() => () => disposeSounds(), []);

  const start = useCallback(() => {
    setTimer((prev) => {
      if (prev.isRunning) return prev;
      if (soundEnabled) {
        playStart();
        if (prev.mode === "work") {
          startAmbient();
        }
      }
      if (prev.mode === "work" && prev.secondsLeft === prev.phaseDurationSeconds) {
        push(MESSAGES.sessionStart, "focus");
      }
      return { ...prev, isRunning: true };
    });
  }, [push, soundEnabled]);

  const pause = useCallback(() => {
    stopAmbient();
    setTimer((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    if (soundEnabled) {
      playReset();
    }
    stopAmbient();
    setTimer(resetTimer(settingsRef.current));
  }, [soundEnabled]);

  const skipPhase = useCallback(() => {
    stopAmbient();
    if (soundEnabled) {
      playBell();
    }
    setTimer((prev) => {
      const { timer: next, sessionToAppend } = finishPhase(prev, settingsRef.current);
      if (sessionToAppend) {
        appendFocusSession(sessionToAppend);
        queueMicrotask(() => {
          awardFocusSession();
        });
      }
      return next;
    });
  }, [soundEnabled, appendFocusSession, awardFocusSession]);

  const value = useMemo(
    () => ({
      timer,
      settings,
      start,
      pause,
      reset,
      skipPhase,
      isFocusActive,
    }),
    [timer, settings, start, pause, reset, skipPhase, isFocusActive]
  );

  useEffect(() => {
    const root = document.body;
    if (value.isFocusActive) root.dataset.flowtainFocus = "on";
    else delete root.dataset.flowtainFocus;
    return () => delete root.dataset.flowtainFocus;
  }, [value.isFocusActive]);

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer requires TimerProvider");
  return ctx;
}
