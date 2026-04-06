const KEY = "flowtain-auth-v1";

/**
 * @returns {{ name: string; email: string } | null}
 */
export function loadUser() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.name !== "string" || typeof data.email !== "string") return null;
    return { name: data.name.trim(), email: data.email.trim() };
  } catch {
    return null;
  }
}

export function saveUser(user) {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function clearUser() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function validateLogin({ name, email }) {
  const n = String(name || "").trim();
  const e = String(email || "").trim();
  if (n.length < 1) return { ok: false, error: "Name is required." };
  if (e.length < 3 || !e.includes("@")) return { ok: false, error: "Valid email is required." };
  return { ok: true, user: { name: n, email: e } };
}
