import { useCallback, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../constants/brand.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { MESSAGES } from "../utils/messages.js";

export function AuthPage() {
  const { user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const result = login({ name, email });
      if (!result.ok) {
        setError(result.error || "Check your details.");
        return;
      }
      setError("");
      navigate("/", { replace: true });
    },
    [login, name, email, navigate]
  );

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg shadow-brand-500/30" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{BRAND_NAME}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{MESSAGES.loginSubtitle}</p>
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{MESSAGES.loginTitle}</h2>
          <label className="block space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-medium text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Alex"
            />
          </label>
          <label className="block space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-medium text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="you@domain.com"
            />
          </label>
          {error && <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5"
          >
            Enter Flowtain
          </button>
        </form>
      </div>
    </div>
  );
}
