import { useCallback } from "react";
import { useTaskWorkspace } from "../../context/TaskContext.jsx";
import { MESSAGES } from "../../utils/messages.js";

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
    </label>
  );
}

export function SettingsForm() {
  const { settings, updateSettings, resetWorkspace } = useTaskWorkspace();

  const onReset = useCallback(() => {
    if (window.confirm(MESSAGES.resetConfirm)) {
      resetWorkspace();
    }
  }, [resetWorkspace]);

  return (
    <div className="mx-auto max-w-xl space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pomodoro lengths</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Applied when the timer is paused.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <Field label="Focus (min)">
            <input
              type="number"
              min={1}
              max={180}
              value={settings.workMinutes}
              onChange={(e) => updateSettings({ workMinutes: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </Field>
          <Field label="Short break (min)">
            <input
              type="number"
              min={1}
              max={60}
              value={settings.shortBreakMinutes}
              onChange={(e) => updateSettings({ shortBreakMinutes: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </Field>
          <Field label="Long break (min)">
            <input
              type="number"
              min={1}
              max={60}
              value={settings.longBreakMinutes}
              onChange={(e) => updateSettings({ longBreakMinutes: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </Field>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-8 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Experience</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Theme is controlled from the header (top-right). Flowtain persists it locally.
        </p>
        <div className="mt-6">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Phase complete sound</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Short chime when a timer phase ends</div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
          </label>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-8 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Clears tasks, sessions, timer, and progression points. Account login stays — log out from the header if needed.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          Reset workspace & progress
        </button>
      </div>
    </div>
  );
}
