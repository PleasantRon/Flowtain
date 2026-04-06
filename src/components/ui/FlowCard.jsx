import { motion } from "framer-motion";

export function FlowCard({ className = "", children, ...props }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.28, type: "spring", stiffness: 220, damping: 22 }}
      className={`rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/10 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
