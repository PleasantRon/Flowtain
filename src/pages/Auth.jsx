import { useCallback, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../constants/brand.js";
import { useAuth } from "../context/AuthContext.jsx";
import { MESSAGES } from "../utils/messages.js";

export function AuthPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_34%),linear-gradient(180deg,#f8fafc,#eef2ff_60%,#f8fafc)] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white/96 shadow-[0_28px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/80 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-between gap-8 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.92))] px-6 py-8 sm:px-8 sm:py-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg shadow-brand-500/25" />
                <div>
                  <p className="text-sm font-semibold tracking-[0.18em] text-brand-600">{BRAND_NAME}</p>
                  <p className="text-sm text-slate-500">A calm workspace for focused work.</p>
                </div>
              </div>

              <div className="mt-12 max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Welcome</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                  Step in and start the next session.
                </h1>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Keep your timer, tasks, and work summaries in one clean place that feels easy to use on every screen.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-white/82 px-4 py-4 ring-1 ring-slate-200/70">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Focus</p>
                <p className="mt-2 text-sm font-medium text-slate-700">Clear timer flow</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/82 px-4 py-4 ring-1 ring-slate-200/70">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Plan</p>
                <p className="mt-2 text-sm font-medium text-slate-700">Tasks close at hand</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/82 px-4 py-4 ring-1 ring-slate-200/70">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Review</p>
                <p className="mt-2 text-sm font-medium text-slate-700">Sessions worth keeping</p>
              </div>
            </div>
          </section>

          <section className="flex items-center px-5 py-6 sm:px-8 sm:py-10">
            <form onSubmit={onSubmit} className="w-full space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Sign in</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{MESSAGES.loginTitle}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">{MESSAGES.loginSubtitle}</p>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  className="mt-2 w-full rounded-[1.35rem] bg-slate-50 px-4 py-4 text-base font-medium text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-brand-400"
                  placeholder="Alex"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="mt-2 w-full rounded-[1.35rem] bg-slate-50 px-4 py-4 text-base font-medium text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-brand-400"
                  placeholder="you@domain.com"
                />
              </label>

              {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

              <button
                type="submit"
                className="min-h-[3.5rem] w-full rounded-[1.35rem] bg-gradient-to-r from-brand-600 to-accent-500 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5"
              >
                Enter Flowtain
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
