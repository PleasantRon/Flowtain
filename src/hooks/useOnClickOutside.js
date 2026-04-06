import { useEffect } from "react";

/**
 * @param {React.RefObject<HTMLElement | null>} ref
 * @param {boolean} enabled
 * @param {(event: MouseEvent | TouchEvent) => void} handler
 */
export function useOnClickOutside(ref, enabled, handler) {
  useEffect(() => {
    if (!enabled) return undefined;
    const listener = (event) => {
      const el = ref.current;
      if (!el || el.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, enabled, handler]);
}
