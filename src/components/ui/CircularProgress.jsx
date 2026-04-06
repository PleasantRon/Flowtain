import { motion } from "framer-motion";
import { useId } from "react";

export function CircularProgress({ progress = 0, label, value, subtext }) {
  const id = useId();
  const gradientId = `flowtainGradient-${id}`;
  const radius = 44;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="rgba(148,163,184,0.24)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            transform="rotate(-90 60 60)"
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{label}</span>
          <span className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{subtext}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Progress {Math.round(progress * 100)}%</p>
      </div>
    </div>
  );
}
