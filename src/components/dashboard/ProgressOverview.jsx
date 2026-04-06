/** Presentational: points, level label, streak. */
export function ProgressOverview({ points, levelLabel, streak }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Points</div>
        <div className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{points}</div>
        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Earned through focus + execution</div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Rank</div>
        <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{levelLabel}</div>
        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Identity follows consistency</div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Streak</div>
        <div className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{streak}d</div>
        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Days locked in (focus days)</div>
      </div>
    </div>
  );
}
