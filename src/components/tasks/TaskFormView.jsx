export function TaskFormView({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="task-title" className="sr-only">
          New task
        </label>
        <input
          id="task-title"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add a task…"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
      >
        Add task
      </button>
    </form>
  );
}
