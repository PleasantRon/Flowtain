import { useMemo, useState } from "react";
import { EmptyTasksIllustration } from "../illustrations/EmptyTasksIllustration.jsx";
import { useTaskWorkspace } from "../../context/TaskContext.jsx";
import { TaskItem } from "./TaskItem.jsx";
import { TaskListView } from "./TaskListView.jsx";

const filters = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "done", label: "Done" },
];

export function TaskList() {
  const { tasks } = useTaskWorkspace();
  const [filter, setFilter] = useState("all");

  const visible = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "done") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const emptyState =
    tasks.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        <EmptyTasksIllustration />
        No tasks yet. Add one above to get started.
      </div>
    ) : null;

  return (
    <>
      <TaskListView
        emptyState={emptyState}
        filters={filters}
        activeFilter={filter}
        onFilterChange={setFilter}
        visibleTasks={visible}
        renderItem={(task) => <TaskItem key={task.id} task={task} />}
      />
      {tasks.length > 0 && visible.length === 0 && (
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">Nothing in this filter.</p>
      )}
    </>
  );
}
