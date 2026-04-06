import { buildTaskRecord } from "./workspaceService.js";

/**
 * Pure task list operations (no I/O).
 * @param {import('../context/TaskContext.jsx').Task[]} tasks
 * @param {string} title
 */
export function addTask(tasks, title) {
  const t = String(title || "").trim();
  if (!t) return tasks;
  return [buildTaskRecord(t), ...tasks];
}

/**
 * @param {import('../context/TaskContext.jsx').Task[]} tasks
 */
export function updateTaskTitle(tasks, id, title) {
  const next = String(title || "").trim();
  if (!id || !next) return tasks;
  return tasks.map((x) => (x.id === id ? { ...x, title: next } : x));
}

/**
 * @param {import('../context/TaskContext.jsx').Task[]} tasks
 */
export function toggleTaskComplete(tasks, id) {
  if (!id) return tasks;
  return tasks.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x));
}

/**
 * @param {import('../context/TaskContext.jsx').Task[]} tasks
 */
export function deleteTask(tasks, id) {
  if (!id) return tasks;
  return tasks.filter((x) => x.id !== id);
}

/**
 * @param {import('../context/TaskContext.jsx').Task[]} tasks
 * @param {string} id
 * @returns {boolean} true if task exists and is now completed after toggle
 */
export function willBeCompletedAfterToggle(tasks, id) {
  const t = tasks.find((x) => x.id === id);
  if (!t) return false;
  return !t.completed;
}
