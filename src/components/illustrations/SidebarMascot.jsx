import { useId } from "react";

/** Compact Flowtain “sentinel” mascot: friendly focus blob + gradient core. */
export function SidebarMascot({ className = "" }) {
  const gid = useId();
  const safe = gid.replace(/:/g, "");
  const gradId = `sb-mascot-${safe}`;
  const glowId = `sb-glow-${safe}`;

  return (
    <div
      className={`flex h-14 items-center justify-center ${className}`}
      role="img"
      aria-label="Flowtain mascot"
    >
      <svg viewBox="0 0 120 56" className="h-14 w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="48" rx="28" ry="5" className="fill-slate-900/5 dark:fill-black/40" />
        <circle cx="60" cy="30" r="22" fill={`url(#${glowId})`} />
        <path
          d="M60 14c-11 0-20 9-20 20v2c0 3 2 5 5 5h30c3 0 5-2 5-5v-2c0-11-9-20-20-20z"
          fill="currentColor"
          className="text-slate-100 dark:text-slate-800"
          stroke={`url(#${gradId})`}
          strokeWidth="1.5"
        />
        {/* Headphones band */}
        <path
          d="M38 26c0-12 10-18 22-18s22 6 22 18"
          stroke={`url(#${gradId})`}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <rect x="34" y="26" width="6" height="14" rx="3" fill={`url(#${gradId})`} opacity="0.85" />
        <rect x="80" y="26" width="6" height="14" rx="3" fill={`url(#${gradId})`} opacity="0.85" />
        {/* Face — calm focus */}
        <circle cx="52" cy="30" r="2.5" className="fill-slate-700 dark:fill-slate-200" />
        <circle cx="68" cy="30" r="2.5" className="fill-slate-700 dark:fill-slate-200" />
        <path d="M54 38c2.5 2 9.5 2 12 0" className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Core “flow” dot */}
        <circle cx="60" cy="22" r="4" fill={`url(#${gradId})`} />
      </svg>
    </div>
  );
}
