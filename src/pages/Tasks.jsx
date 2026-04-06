import { TaskForm } from "../components/tasks/TaskForm.jsx";
import { TaskList } from "../components/tasks/TaskList.jsx";

export function Tasks() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tasks</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Capture work, check things off, and keep your list lightweight.
        </p>
      </div>
      <TaskForm />
      <TaskList />
    </div>
  );
}
