const PERIODS = {
  today: "Today",
  week: "This Week",
  month: "This Month",
};

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function startOfWeek(date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + offset);
  return next;
}

function endOfWeek(date) {
  const next = startOfWeek(date);
  next.setDate(next.getDate() + 6);
  return endOfDay(next);
}

function startOfMonth(date) {
  const next = new Date(date.getFullYear(), date.getMonth(), 1);
  return startOfDay(next);
}

function endOfMonth(date) {
  const next = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return endOfDay(next);
}

export function formatMinutesAsHoursMinutes(totalMinutes) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes || 0));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function getDateRangeForPeriod(period, referenceDate = new Date()) {
  if (period === "today") {
    return { start: startOfDay(referenceDate), end: endOfDay(referenceDate), label: PERIODS.today };
  }
  if (period === "month") {
    return { start: startOfMonth(referenceDate), end: endOfMonth(referenceDate), label: PERIODS.month };
  }
  return { start: startOfWeek(referenceDate), end: endOfWeek(referenceDate), label: PERIODS.week };
}

export function getSessionsForPeriod(sessions, period, referenceDate = new Date()) {
  const { start, end } = getDateRangeForPeriod(period, referenceDate);

  return (sessions ?? []).filter((session) => {
    const startedAt = new Date(session.start);
    return startedAt >= start && startedAt <= end;
  });
}

export function getTotalMinutes(sessions) {
  return (sessions ?? []).reduce((sum, session) => sum + Number(session.duration || 0), 0);
}

export function getTotalsByPeriod(sessions, referenceDate = new Date()) {
  const todayMinutes = getTotalMinutes(getSessionsForPeriod(sessions, "today", referenceDate));
  const weekMinutes = getTotalMinutes(getSessionsForPeriod(sessions, "week", referenceDate));
  const monthMinutes = getTotalMinutes(getSessionsForPeriod(sessions, "month", referenceDate));

  return {
    todayMinutes,
    weekMinutes,
    monthMinutes,
    todayLabel: formatMinutesAsHoursMinutes(todayMinutes),
    weekLabel: formatMinutesAsHoursMinutes(weekMinutes),
    monthLabel: formatMinutesAsHoursMinutes(monthMinutes),
  };
}

export function groupSessionsByTask(sessions) {
  const grouped = new Map();

  for (const session of sessions ?? []) {
    const key = session.task || "General focus";
    grouped.set(key, (grouped.get(key) || 0) + Number(session.duration || 0));
  }

  return Array.from(grouped.entries())
    .map(([task, minutes]) => ({ task, minutes }))
    .sort((left, right) => right.minutes - left.minutes);
}

function formatRangeDate(date, includeMonth = true) {
  return new Intl.DateTimeFormat(
    "en-US",
    includeMonth ? { month: "long", day: "numeric" } : { day: "numeric" }
  ).format(date);
}

export function formatDateRangeLabel(period, referenceDate = new Date()) {
  const { start, end, label } = getDateRangeForPeriod(period, referenceDate);
  if (period === "today") {
    return `${label}: ${formatRangeDate(start)}`;
  }

  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const endLabel = sameMonth ? formatRangeDate(end, false) : formatRangeDate(end);
  return `${label}: ${formatRangeDate(start)}-${endLabel}`;
}

export function buildWorkSummary({ sessions, period = "week", hourlyRate = 0, referenceDate = new Date() }) {
  const periodSessions = getSessionsForPeriod(sessions, period, referenceDate);
  const totalMinutes = getTotalMinutes(periodSessions);
  const breakdown = groupSessionsByTask(periodSessions);
  const safeRate = Number.isFinite(Number(hourlyRate)) ? Number(hourlyRate) : 0;
  const totalHours = totalMinutes / 60;
  const earnings = totalHours * safeRate;

  const lines = [
    formatDateRangeLabel(period, referenceDate),
    `Total Time: ${formatMinutesAsHoursMinutes(totalMinutes)}`,
    "Breakdown:",
  ];

  if (breakdown.length === 0) {
    lines.push("- No focus sessions recorded");
  } else {
    for (const item of breakdown) {
      lines.push(`- ${item.task} -> ${formatMinutesAsHoursMinutes(item.minutes)}`);
    }
  }

  if (safeRate > 0) {
    lines.push(`Hourly Rate: $${safeRate.toFixed(2)}`);
    lines.push(`Estimated Earnings: $${earnings.toFixed(2)}`);
  }

  return {
    period,
    totalMinutes,
    totalLabel: formatMinutesAsHoursMinutes(totalMinutes),
    breakdown,
    periodSessions,
    rangeLabel: formatDateRangeLabel(period, referenceDate),
    earnings,
    summaryText: lines.join("\n"),
  };
}
