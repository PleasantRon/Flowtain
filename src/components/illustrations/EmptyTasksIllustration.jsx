import { useId } from "react";

/** Empty-state art: checklist + focus arc + sparkles (SVG, theme-aware strokes). */
export function EmptyTasksIllustration({ className = "" }) {
  const gid = useId();
  const gradId = `empty-tasks-grad-${gid.replace(/:/g, "")}`;

  return (
    <div
      className={`mx-auto mb-4 flex max-w-[220px] items-center justify-center text-slate-900 dark:text-slate-100 ${className}`}
      role="img"
      aria-label="Illustration of an empty task list ready for your first item"
    >
      <svg viewBox="0 0 220 100" className="h-24 w-full max-w-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {/* Soft panel */}
        <rect
          x="8"
          y="12"
          width="124"
          height="76"
          rx="12"
          className="stroke-slate-200 dark:stroke-slate-600"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity="0.07"
        />
        {/* Task rows */}
        <circle cx="28" cy="36" r="6" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="1.5" />
        <line x1="42" y1="36" x2="108" y2="36" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="28" cy="58" r="6" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="1.5" />
        <line x1="42" y1="58" x2="96" y2="58" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M24 72 L27 76 L34 68"
          stroke={`url(#${gradId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <line x1="42" y1="74" x2="102" y2="74" className="stroke-slate-200 dark:stroke-slate-600" strokeWidth="1.5" strokeLinecap="round" />
        {/* Focus arc */}
        <path
          d="M 148 78 A 38 38 0 1 1 148 22"
          stroke={`url(#${gradId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <circle cx="178" cy="32" r="5" fill={`url(#${gradId})`} opacity="0.9" />
        {/* Sparkles */}
        <path d="M196 48l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" className="fill-amber-400/80 dark:fill-amber-300/70" />
        <path d="M162 14l1.2 3.5 3.5 1.2-3.5 1.2-1.2 3.5-1.2-3.5-3.5-1.2 3.5-1.2z" className="fill-violet-400/70 dark:fill-violet-300/60" />
      </svg>
    </div>
  );
}
