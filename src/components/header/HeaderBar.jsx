import { MoonIcon } from "../icons/MoonIcon.jsx";
import { SunIcon } from "../icons/SunIcon.jsx";
import { UserCircleIcon } from "../icons/UserCircleIcon.jsx";
import { MenuIcon } from "../icons/MenuIcon.jsx";

/**
 * Presentational header: menu, brand, theme icon, profile menu.
 */
export function HeaderBar({
  brandName,
  tagline,
  sidebarOpen,
  onMenuClick,
  menuLabel,
  theme,
  onThemeToggle,
  themeToggleLabel,
  user,
  profileOpen,
  profileRef,
  onProfileButtonClick,
  onLogout,
}) {
  const ThemeIcon = theme === "dark" ? SunIcon : MoonIcon;

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-expanded={sidebarOpen}
          aria-controls="app-sidebar"
          aria-label={menuLabel}
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg shadow-brand-500/25"
            aria-hidden
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white">{brandName}</div>
            <div className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">{tagline}</div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onThemeToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-amber-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-slate-800"
            aria-label={themeToggleLabel}
          >
            <ThemeIcon className="h-5 w-5" />
          </button>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={onProfileButtonClick}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
              >
                <UserCircleIcon className="h-6 w-6" />
              </button>
              {profileOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Signed in</p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={onLogout}
                    className="flex w-full px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
