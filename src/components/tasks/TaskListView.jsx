export function TaskListView({ emptyState, filters, activeFilter, onFilterChange, visibleTasks, renderItem }) {
  if (emptyState) {
    return emptyState;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onFilterChange(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              activeFilter === f.id
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="space-y-3">{visibleTasks.map(renderItem)}</ul>
    </div>
  );
}
