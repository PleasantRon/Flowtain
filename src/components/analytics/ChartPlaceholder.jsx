import { useMemo } from "react";
import { useTaskWorkspace } from "../../context/TaskContext.jsx";
import { dailySessionCounts } from "../../utils/analytics.js";

/** Simple CSS bar chart placeholder (no external chart lib). */
export function ChartPlaceholder({ days = 7 }) {
  const { focusSessions } = useTaskWorkspace();
  const { labels, values } = useMemo(
    () => dailySessionCounts(focusSessions, days),
    [focusSessions, days]
  );
  const max = Math.max(1, ...values);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Focus rhythm</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sessions per day (placeholder chart — swap for Recharts / Chart.js later)
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-slate-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-700">
          Chart area
        </div>
      </div>
      <div className="mt-6 flex h-44 items-end gap-2">
        {values.map((v, i) => (
          <div key={labels[i]} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full max-w-[2.5rem] rounded-t-lg bg-gradient-to-t from-brand-600/20 to-brand-600/70 transition hover:from-brand-600/30 hover:to-accent-500/80"
              style={{ height: `${(v / max) * 100}%`, minHeight: v === 0 ? "4px" : "8px" }}
              title={`${labels[i]}: ${v}`}
            />
            <span className="text-[10px] font-medium text-slate-400">
              {labels[i].slice(5).replace("-", "/")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
