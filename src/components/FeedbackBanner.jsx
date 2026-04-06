import { useFlowFeedback } from "../hooks/useFlowFeedback.jsx";

const variants = {
  default:
    "border border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50",
  /** Task / session praise — solid surfaces so text never disappears on the page */
  intense:
    "border-2 border-brand-600 bg-white text-slate-900 shadow-2xl shadow-brand-900/15 ring-1 ring-slate-900/5 " +
    "dark:border-brand-400 dark:bg-slate-800 dark:text-white dark:shadow-black/50 dark:ring-white/10",
  points:
    "border-2 border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-400 dark:bg-slate-800 dark:text-emerald-100",
  level:
    "border-2 border-amber-600 bg-amber-50 text-amber-950 dark:border-amber-400 dark:bg-slate-800 dark:text-amber-100",
  streak:
    "border-2 border-cyan-600 bg-cyan-50 text-cyan-950 dark:border-cyan-400 dark:bg-slate-800 dark:text-cyan-100",
  focus: "border-2 border-slate-600 bg-slate-900 text-white dark:border-slate-500 dark:bg-slate-950 dark:text-white",
};

export function FeedbackBanner() {
  const { message, clear } = useFlowFeedback();
  if (!message) return null;

  const style = variants[message.variant] || variants.default;

  return (
    <div
      role="status"
      className={`pointer-events-auto fixed bottom-4 left-1/2 z-[100] w-[min(100%-2rem,32rem)] -translate-x-1/2 rounded-2xl px-4 py-3 text-sm font-semibold ${style}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="whitespace-pre-line leading-relaxed text-inherit">{message.text}</p>
        <button
          type="button"
          onClick={clear}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/15"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
