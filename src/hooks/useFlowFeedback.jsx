import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const FeedbackContext = createContext(null);

export function FlowFeedbackProvider({ children }) {
  const [message, setMessage] = useState(null);
  const timerRef = useRef(null);

  const clear = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setMessage(null);
  }, []);

  const push = useCallback(
    (text, variant = "default") => {
      if (!text) return;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setMessage({ text, variant, id: Date.now() });
      timerRef.current = window.setTimeout(() => {
        setMessage(null);
        timerRef.current = null;
      }, 5200);
    },
    []
  );

  useEffect(() => () => clear(), [clear]);

  const value = useMemo(() => ({ message, push, clear }), [message, push, clear]);

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
}

export function useFlowFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFlowFeedback requires FlowFeedbackProvider");
  return ctx;
}
