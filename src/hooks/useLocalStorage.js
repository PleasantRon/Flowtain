import { useCallback, useEffect, useState } from "react";

/**
 * Sync state with localStorage (string values).
 * @param {string} key
 * @param {string} initial
 */
export function useLocalStorageString(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ?? initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        try {
          localStorage.setItem(key, resolved);
        } catch {
          /* ignore */
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, set];
}

/**
 * @template T
 * @param {string} key
 * @param {() => T} getInitial
 * @param {(v: T) => void} persist
 */
export function usePersistedValue(key, getInitial, persist) {
  const [value, setValue] = useState(getInitial);

  useEffect(() => {
    persist(value);
  }, [value, persist]);

  return [value, setValue];
}
