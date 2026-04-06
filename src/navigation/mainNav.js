/** Primary app routes — single source for sidebar & any future nav. */
export const MAIN_NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/tasks", label: "Tasks", end: false },
  { to: "/analytics", label: "Analytics", end: false },
  { to: "/settings", label: "Settings", end: false },
];
