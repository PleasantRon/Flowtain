import { Link } from "react-router-dom";
import { BRAND_TAGLINE } from "../constants/brand.js";
import { ProgressOverview } from "../components/dashboard/ProgressOverview.jsx";
import { PomodoroTimer } from "../components/timer/PomodoroTimer.jsx";
import { StatsCards } from "../components/analytics/StatsCards.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTaskWorkspace } from "../context/TaskContext.jsx";
import { usePoints } from "../hooks/usePoints.jsx";
import { useTimer } from "../hooks/useTimer.jsx";
import { MESSAGES } from "../utils/messages.js";

export function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTaskWorkspace();
  const { points, streak, level } = usePoints();
  const { isFocusActive } = useTimer();
  const recent = tasks.slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/40 p-8 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80 sm:p-10">
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-300">
          {user ? MESSAGES.dashboardGreeting(user.name) : "Welcome"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {BRAND_TAGLINE}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Plan fast. Lock in deeper. Let the loop compound.
        </p>
        {isFocusActive && (
          <div className="mt-4 inline-flex rounded-full border border-brand-500/40 bg-brand-600/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-800 dark:text-brand-100">
            Focus mode engaged
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/tasks"
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Plan tasks
          </Link>
          <Link
            to="/analytics"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            View analytics
          </Link>
        </div>
      </div>

      <ProgressOverview points={points} levelLabel={level.label} streak={streak} />

      <PomodoroTimer />

      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">At a glance</h2>
        <StatsCards />
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent tasks</h2>
          <Link to="/tasks" className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300">
            See all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No tasks yet — add some on the Tasks page.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <span
                  className={`text-sm font-medium ${t.completed ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"}`}
                >
                  {t.title}
                </span>
                <span className="text-xs text-slate-400">{t.completed ? "Done" : "Open"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
