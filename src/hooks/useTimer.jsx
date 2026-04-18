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
  disposeSounds,
  playBell,
  playReset,
  playStart,
  startAmbient,
  stopAmbient,
} from "../utils/sounds.js";
import { saveFocusSession } from "../utils/sessionStorage.js";
import {
  alignTimerToSettings,
  createInitialTimer,
  finishPhase,
  resetTimer,
  tickTimer,
} from "../utils/timerEngine.js";

const TimerContext = createContext(null);
const DEFAULT_TASK_LABEL = "General focus";

function normalizeTaskOptions(tasks) {
  const titles = (tasks ?? [])
    .map((task) => task?.title?.trim())
    .filter(Boolean);

  const uniqueTitles = Array.from(new Set(titles));
  return uniqueTitles.length > 0 ? uniqueTitles : [DEFAULT_TASK_LABEL];
}

function buildSavedSession({ start, end, task }) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) {
    return null;
  }

  const duration = Math.max(1, Math.round((endTime - startTime) / 60000));
  return {
    start,
    end,
    duration,
    task: task || DEFAULT_TASK_LABEL,
    type: "focus",
  };
}

export function TimerProvider({ children }) {
  const { settings, appendFocusSession, resetClockSignal, tasks } = useTaskWorkspace();
  const { awardFocusSession } = usePoints();
  const { push } = useFlowFeedback();

  const [timer, setTimer] = useState(() => createInitialTimer(settings));
  const taskOptions = useMemo(() => normalizeTaskOptions(tasks), [tasks]);
  const [selectedTask, setSelectedTask] = useState(() => taskOptions[0]);

  const settingsRef = useRef(settings);
  const activeSessionRef = useRef(null);
  const selectedTaskRef = useRef(selectedTask);

  settingsRef.current = settings;
  selectedTaskRef.current = selectedTask;

  const { workMinutes, shortBreakMinutes, longBreakMinutes, soundEnabled } = settings;

  useEffect(() => {
    if (!taskOptions.includes(selectedTaskRef.current)) {
      setSelectedTask(taskOptions[0]);
    }
  }, [taskOptions]);

  useEffect(() => {
    setTimer((prev) => alignTimerToSettings(prev, settings));
  }, [workMinutes, shortBreakMinutes, longBreakMinutes, settings]);

  useEffect(() => {
    if (resetClockSignal === 0) return;
    activeSessionRef.current = null;
    setTimer(createInitialTimer(settingsRef.current));
  }, [resetClockSignal]);

  const persistActiveSession = useCallback((endIso = new Date().toISOString()) => {
    if (!activeSessionRef.current) return;

    const nextSession = buildSavedSession({
      ...activeSessionRef.current,
      end: endIso,
      task: activeSessionRef.current.task || selectedTaskRef.current,
    });

    activeSessionRef.current = null;

    if (!nextSession) return;
    saveFocusSession(nextSession);
  }, []);

  useEffect(() => {
    if (!timer.isRunning) return undefined;

    const id = window.setInterval(() => {
      setTimer((prev) => {
        const isWorkPhaseEnding = prev.mode === "work" && prev.secondsLeft <= 1;
        if (isWorkPhaseEnding) {
          stopAmbient();
          persistActiveSession();
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
  }, [timer.isRunning, appendFocusSession, awardFocusSession, persistActiveSession]);

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

      if (prev.mode === "work") {
        activeSessionRef.current = {
          start: new Date().toISOString(),
          task: selectedTaskRef.current || DEFAULT_TASK_LABEL,
        };
      } else {
        activeSessionRef.current = null;
      }

      if (prev.mode === "work" && prev.secondsLeft === prev.phaseDurationSeconds) {
        push(MESSAGES.sessionStart, "focus");
      }

      return { ...prev, isRunning: true };
    });
  }, [push, soundEnabled]);

  const pause = useCallback(() => {
    stopAmbient();
    if (timer.isRunning && timer.mode === "work") {
      persistActiveSession();
    }
    setTimer((prev) => ({ ...prev, isRunning: false }));
  }, [persistActiveSession, timer.isRunning, timer.mode]);

  const reset = useCallback(() => {
    if (soundEnabled) {
      playReset();
    }
    stopAmbient();
    if (timer.isRunning && timer.mode === "work") {
      persistActiveSession();
    } else {
      activeSessionRef.current = null;
    }
    setTimer(resetTimer(settingsRef.current));
  }, [persistActiveSession, soundEnabled, timer.isRunning, timer.mode]);

  const skipPhase = useCallback(() => {
    stopAmbient();
    if (timer.isRunning && timer.mode === "work") {
      persistActiveSession();
    } else {
      activeSessionRef.current = null;
    }
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
  }, [appendFocusSession, awardFocusSession, persistActiveSession, soundEnabled, timer.isRunning, timer.mode]);

  const value = useMemo(
    () => ({
      timer,
      settings,
      start,
      pause,
      reset,
      skipPhase,
      isFocusActive,
      selectedTask,
      setSelectedTask,
      taskOptions,
    }),
    [
      timer,
      settings,
      start,
      pause,
      reset,
      skipPhase,
      isFocusActive,
      selectedTask,
      taskOptions,
    ]
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
