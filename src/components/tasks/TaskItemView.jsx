export function TaskItemView({
  task,
  editing,
  draftTitle,
  onDraftChange,
  onSaveEdit,
  onEditKeyDown,
  onStartEdit,
  onToggle,
  onDelete,
}) {
  return (
    <li className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-brand-900">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      />
      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            value={draftTitle}
            onChange={(e) => onDraftChange(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={onEditKeyDown}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={onStartEdit}
            className={`w-full text-left text-sm font-medium ${task.completed ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"}`}
          >
            {task.title}
          </button>
        )}
        <div className="mt-1 text-xs text-slate-400">Added {new Date(task.createdAt).toLocaleDateString()}</div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950/40 dark:hover:text-red-400"
      >
        Remove
      </button>
    </li>
  );
}
