import { NavLink } from "react-router-dom";
import { SidebarMascot } from "../illustrations/SidebarMascot.jsx";

const linkBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800";
const linkActive = "bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-100";

/**
 * Presentational drawer — navigation + logout. Visibility/position controlled via className wrappers.
 */
export function SidebarDrawerView({
  asideId = "app-sidebar",
  brandName,
  tagline,
  navItems,
  onLogout,
  asideClassName,
  backdropClassName,
  showBackdrop,
  onBackdropClick,
  navAriaLabel,
}) {
  return (
    <>
      {showBackdrop ? (
        <button
          type="button"
          className={backdropClassName}
          aria-label="Close menu"
          onClick={onBackdropClick}
        />
      ) : null}
      <aside id={asideId} className={asideClassName}>
        <div className="flex h-full flex-col overflow-y-auto px-3 py-6">
          <div className="mb-8 flex items-center gap-2 px-2">
            <span
              className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg shadow-brand-500/25"
              aria-hidden
            />
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{brandName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{tagline}</div>
            </div>
          </div>
          <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto" aria-label={navAriaLabel}>
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : "text-slate-600 dark:text-slate-300"}`}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto space-y-4 pt-4">
            <div className="border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onLogout}
                className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                Logout
              </button>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-200 p-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <div className="mb-2 rounded-lg bg-slate-100/90 dark:bg-slate-800/50">
                <SidebarMascot />
              </div>
              Open → Plan → Lock In → Reward → Repeat.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
