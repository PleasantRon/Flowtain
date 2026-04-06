import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  addTask as addTaskOp,
  deleteTask as deleteTaskOp,
  toggleTaskComplete,
  updateTaskTitle as updateTitleOp,
  willBeCompletedAfterToggle,
} from "../services/taskService.js";
import {
  clearWorkspace,
  createEmptyWorkspace,
  loadWorkspace,
  saveWorkspace,
} from "../services/workspaceService.js";
import { useFlowFeedback } from "../hooks/useFlowFeedback.jsx";
import { usePoints } from "../hooks/usePoints.jsx";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { awardTaskComplete, resetProgress } = usePoints();
  const { push } = useFlowFeedback();

  const [workspace, setWorkspace] = useState(loadWorkspace);
  const [resetClockSignal, setResetClockSignal] = useState(0);
  const workspaceRef = useRef(workspace);
  workspaceRef.current = workspace;

  useEffect(() => {
    saveWorkspace(workspace);
  }, [workspace]);

  const updateSettings = useCallback((partial) => {
    setWorkspace((w) => ({ ...w, settings: { ...w.settings, ...partial } }));
  }, []);

  const appendFocusSession = useCallback((session) => {
    setWorkspace((w) => ({ ...w, focusSessions: [...w.focusSessions, session] }));
  }, []);

  const addTask = useCallback((title) => {
    setWorkspace((w) => ({ ...w, tasks: addTaskOp(w.tasks, title) }));
  }, []);

  const updateTaskTitle = useCallback((id, title) => {
    setWorkspace((w) => ({ ...w, tasks: updateTitleOp(w.tasks, id, title) }));
  }, []);

  const toggleTask = useCallback(
    (id) => {
      const w = workspaceRef.current;
      const willComplete = willBeCompletedAfterToggle(w.tasks, id);
      setWorkspace((prev) => ({ ...prev, tasks: toggleTaskComplete(prev.tasks, id) }));
      if (willComplete) {
        awardTaskComplete();
      }
    },
    [awardTaskComplete]
  );

  const deleteTask = useCallback((id) => {
    setWorkspace((w) => ({ ...w, tasks: deleteTaskOp(w.tasks, id) }));
  }, []);

  const resetWorkspace = useCallback(() => {
    clearWorkspace();
    setWorkspace(createEmptyWorkspace());
    resetProgress();
    setResetClockSignal((n) => n + 1);
    push("Workspace cleared. Fresh loop.", "default");
  }, [resetProgress, push]);

  const value = useMemo(
    () => ({
      tasks: workspace.tasks,
      focusSessions: workspace.focusSessions,
      settings: workspace.settings,
      resetClockSignal,
      addTask,
      updateTaskTitle,
      toggleTask,
      deleteTask,
      updateSettings,
      appendFocusSession,
      resetWorkspace,
    }),
    [
      workspace.tasks,
      workspace.focusSessions,
      workspace.settings,
      resetClockSignal,
      addTask,
      updateTaskTitle,
      toggleTask,
      deleteTask,
      updateSettings,
      appendFocusSession,
      resetWorkspace,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskWorkspace() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskWorkspace requires TaskProvider");
  return ctx;
}
