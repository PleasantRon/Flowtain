import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { commendationForSessionComplete, commendationForTaskComplete } from "../utils/commendations.js";
import { MESSAGES } from "../utils/messages.js";
import {
  POINTS_FOCUS_SESSION,
  POINTS_TASK_COMPLETE,
  didLevelUp,
  getLevelInfo,
  nextStreakAfterSession,
} from "../services/pointsService.js";
import { clearProgress, defaultProgress, loadProgress, saveProgress } from "../services/progressService.js";
import { useFlowFeedback } from "./useFlowFeedback.jsx";

const PointsContext = createContext(null);

export function PointsProvider({ children }) {
  const { push } = useFlowFeedback();
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const awardFocusSession = useCallback(() => {
    setProgress((prev) => {
      const before = prev.points;
      const points = before + POINTS_FOCUS_SESSION;
      const streakMeta = nextStreakAfterSession(prev);
      const next = { points, streak: streakMeta.streak, lastLockInDate: streakMeta.lastLockInDate };
      const level = didLevelUp(before, points);
      queueMicrotask(() => {
        const block = [
          commendationForSessionComplete(),
          MESSAGES.sessionComplete,
          MESSAGES.pointsSession,
        ].join("\n\n");
        push(block, "intense");
        if (level) {
          window.setTimeout(() => push(MESSAGES.levelUp(level.level, level.title), "level"), 450);
        }
        if (next.streak >= 2) {
          window.setTimeout(() => push(MESSAGES.streak(next.streak), "streak"), 900);
        }
      });
      return next;
    });
  }, [push]);

  const awardTaskComplete = useCallback(() => {
    setProgress((prev) => {
      const before = prev.points;
      const points = before + POINTS_TASK_COMPLETE;
      const level = didLevelUp(before, points);
      queueMicrotask(() => {
        const block = [commendationForTaskComplete(), MESSAGES.taskComplete].join("\n\n");
        push(block, "intense");
        if (level) {
          window.setTimeout(() => push(MESSAGES.levelUp(level.level, level.title), "level"), 400);
        }
      });
      return { ...prev, points };
    });
  }, [push]);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress());
    clearProgress();
  }, []);

  const level = useMemo(() => getLevelInfo(progress.points), [progress.points]);

  const value = useMemo(
    () => ({
      points: progress.points,
      streak: progress.streak,
      lastLockInDate: progress.lastLockInDate,
      level,
      awardFocusSession,
      awardTaskComplete,
      resetProgress,
    }),
    [progress, level, awardFocusSession, awardTaskComplete, resetProgress]
  );

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error("usePoints requires PointsProvider");
  return ctx;
}
