import { StatsCards } from "../components/analytics/StatsCards.jsx";
import { ChartPlaceholder } from "../components/analytics/ChartPlaceholder.jsx";

export function Analytics() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          High-level signals from your focus sessions and task list (expand with a chart library anytime).
        </p>
      </div>
      <StatsCards />
      <ChartPlaceholder days={7} />
    </div>
  );
}
