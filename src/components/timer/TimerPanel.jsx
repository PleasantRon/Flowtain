import styles from "./TimerPanel.module.css";

/**
 * Presentational timer - no domain logic.
 */
export function TimerPanel({
  mode,
  modeLabel,
  clock,
  compact,
  soundOn,
  progressPercent,
  isRunning,
  isFocusActive,
  phaseMotionKey,
  onStart,
  onPause,
  onReset,
  onSkip,
}) {
  const startLabel = isRunning ? "Pause" : mode === "work" ? "Start focus" : "Start break";

  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 ${styles.panel} ${isFocusActive ? styles.focusPanel : ""}`}
      aria-label="Pomodoro timer"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div key={phaseMotionKey} className={styles.phaseMotion}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">{modeLabel}</p>
          <p
            className={`mt-1 text-4xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white sm:text-5xl ${styles.clockGlow} ${isFocusActive ? styles.focusGlow : ""}`}
          >
            {clock}
          </p>
          {!compact && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Long break after every 4 focus sessions / Sound {soundOn ? "on" : "off"}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={isRunning ? onPause : onStart}
            className={`rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700 ${styles.buttonBase} ${styles.primaryButton} ${isFocusActive ? styles.focusButton : ""}`}
          >
            {startLabel}
          </button>
          <button
            type="button"
            onClick={onReset}
            className={`rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${styles.buttonBase}`}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onSkip}
            className={`rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-700 dark:border-slate-600 dark:text-slate-300 ${styles.buttonBase}`}
          >
            Skip phase
          </button>
        </div>
      </div>
      <div className="mt-5">
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r from-brand-600 to-accent-500 transition-[width] duration-1000 ease-linear ${isFocusActive ? "shadow-[0_0_18px_rgba(14,165,233,0.28)]" : ""}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
