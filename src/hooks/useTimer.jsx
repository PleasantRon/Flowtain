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
import {
  alignTimerToSettings,
  createInitialTimer,
  finishPhase,
  resetTimer,
  tickTimer,
} from "../utils/timerEngine.js";

const TimerContext = createContext(null);

function playChime(enabled) {
  if (!enabled) return;
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.value = 0.04;
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 160);
  } catch {
    /* ignore */
  }
}

export function TimerProvider({ children }) {
  const { settings, appendFocusSession, resetClockSignal } = useTaskWorkspace();
  const { awardFocusSession } = usePoints();
  const { push } = useFlowFeedback();

  const [timer, setTimer] = useState(() => createInitialTimer(settings));
  const prevModeRef = useRef(timer.mode);
  const bootRef = useRef(true);
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
    if (bootRef.current) {
      bootRef.current = false;
      prevModeRef.current = timer.mode;
      return;
    }
    if (prevModeRef.current !== timer.mode) {
      playChime(soundEnabled);
    }
    prevModeRef.current = timer.mode;
  }, [timer.mode, soundEnabled]);

  useEffect(() => {
    if (!timer.isRunning) return undefined;
    const id = window.setInterval(() => {
      setTimer((prev) => {
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

  const start = useCallback(() => {
    setTimer((prev) => {
      if (prev.isRunning) return prev;
      if (prev.mode === "work" && prev.secondsLeft === prev.phaseDurationSeconds) {
        push(MESSAGES.sessionStart, "focus");
      }
      return { ...prev, isRunning: true };
    });
  }, [push]);

  const pause = useCallback(() => {
    setTimer((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    setTimer(resetTimer(settingsRef.current));
  }, []);

  const skipPhase = useCallback(() => {
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
  }, [settings, appendFocusSession, awardFocusSession]);

  const value = useMemo(
    () => ({
      timer,
      settings,
      start,
      pause,
      reset,
      skipPhase,
      isFocusActive: timer.isRunning && timer.mode === "work",
    }),
    [timer, settings, start, pause, reset, skipPhase]
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
