import { useMemo } from "react";
import { useTaskWorkspace } from "../../context/TaskContext.jsx";
import { dailySessionCounts, taskCompletionRate, totalFocusMinutes } from "../../utils/analytics.js";
import { StatsCardsView } from "./StatsCardsView.jsx";

export function StatsCards() {
  const { tasks, focusSessions } = useTaskWorkspace();

  const cards = useMemo(() => {
    const last7 = dailySessionCounts(focusSessions, 7);
    const weekTotal = last7.values.reduce((a, b) => a + b, 0);
    const minutes = totalFocusMinutes(focusSessions);
    const rate = taskCompletionRate(tasks);
    return [
      { label: "Focus sessions (7d)", value: String(weekTotal), hint: "Completed work phases" },
      { label: "Total focus time", value: `${minutes}m`, hint: "All-time logged" },
      { label: "Task completion", value: `${rate}%`, hint: "Done vs total" },
    ];
  }, [focusSessions, tasks]);

  return <StatsCardsView cards={cards} />;
}
