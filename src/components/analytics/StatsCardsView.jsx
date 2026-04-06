export function StatsCardsView({ cards }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{c.label}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{c.value}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{c.hint}</div>
        </div>
      ))}
    </div>
  );
}
