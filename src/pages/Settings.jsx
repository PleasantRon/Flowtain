import { SettingsForm } from "../components/settings/SettingsForm.jsx";

export function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tune Pomodoro lengths, sound, and appearance. Settings persist in your browser.
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
