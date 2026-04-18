import { useEffect, useMemo, useState } from "react";
import {
  buildWorkSummary,
  formatMinutesAsHoursMinutes,
  getTotalsByPeriod,
} from "../../utils/sessionCalculations.js";
import {
  copySummaryText,
  downloadSummaryCsv,
  downloadSummaryPdf,
} from "../../utils/sessionExports.js";
import {
  getHourlyRate,
  getStoredSessions,
  saveHourlyRate,
  subscribeToHourlyRate,
  subscribeToSessions,
} from "../../utils/sessionStorage.js";

export function ChartPlaceholder() {
  const [sessions, setSessions] = useState(getStoredSessions);
  const [period, setPeriod] = useState("week");
  const [hourlyRate, setHourlyRate] = useState(getHourlyRate);
  const [summary, setSummary] = useState(() =>
    buildWorkSummary({ sessions: getStoredSessions(), period: "week", hourlyRate: getHourlyRate() })
  );
  const [copyLabel, setCopyLabel] = useState("Copy summary");

  useEffect(() => subscribeToSessions(setSessions), []);
  useEffect(() => subscribeToHourlyRate(setHourlyRate), []);

  const totals = useMemo(() => getTotalsByPeriod(sessions), [sessions]);
  const liveSummary = useMemo(
    () => buildWorkSummary({ sessions, period, hourlyRate }),
    [sessions, period, hourlyRate]
  );

  useEffect(() => {
    setSummary(buildWorkSummary({ sessions, period, hourlyRate }));
  }, [sessions, hourlyRate]);

  function handleGenerateSummary() {
    setSummary(liveSummary);
  }

  async function handleCopySummary() {
    const copied = await copySummaryText(summary.summaryText);
    setCopyLabel(copied ? "Copied" : "Copy unavailable");
    window.setTimeout(() => setCopyLabel("Copy summary"), 1800);
  }

  function handleHourlyRateChange(event) {
    const value = event.target.value;
    const nextRate = value === "" ? 0 : Number(value);
    const safeRate = Number.isFinite(nextRate) ? nextRate : 0;
    setHourlyRate(safeRate);
    saveHourlyRate(safeRate);
  }

  const summaryBreakdown = summary.breakdown.length > 0 ? summary.breakdown : [{ task: "No focus sessions recorded", minutes: 0 }];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Work summary</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track focus sessions, total logged time, and task breakdowns you can copy or export.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[22rem]">
            <SummaryStat label="Today" value={totals.todayLabel} />
            <SummaryStat label="This week" value={totals.weekLabel} />
            <SummaryStat label="This month" value={totals.monthLabel} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Summary range
                </span>
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Hourly rate
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate || ""}
                  onChange={handleHourlyRateChange}
                  placeholder="0.00"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleGenerateSummary}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Generate Work Summary
              </button>
              <button
                type="button"
                onClick={handleCopySummary}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {copyLabel}
              </button>
              <button
                type="button"
                onClick={() => downloadSummaryCsv(summary)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                Download CSV
              </button>
              <button
                type="button"
                onClick={() => downloadSummaryPdf(summary.summaryText)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                Download PDF
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Generated summary
              </p>
              <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">
                {summary.summaryText}
              </pre>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Selected range
                </p>
                <h4 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {summary.rangeLabel}
                </h4>
              </div>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
                {summary.periodSessions.length} sessions
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MetricCard label="Total time" value={summary.totalLabel} />
              <MetricCard
                label="Estimated earnings"
                value={summary.earnings > 0 ? `$${summary.earnings.toFixed(2)}` : "-"}
              />
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Breakdown by task
              </p>
              <ul className="mt-3 space-y-3">
                {summaryBreakdown.map((item) => (
                  <li
                    key={item.task}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.task}</span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {formatMinutesAsHoursMinutes(item.minutes)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-bold tabular-nums text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
