import { motion } from "framer-motion";

export function PrimaryActionButton({ className = "", pulse = true, children, ...props }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      animate={
        pulse
          ? {
              scale: [1, 1.02, 1],
              opacity: [1, 0.98, 1],
            }
          : undefined
      }
      transition={
        pulse
          ? {
              duration: 2.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }
          : undefined
      }
      className={`inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-3 text-base font-semibold text-white shadow-[0_20px_50px_-26px_rgba(56,189,248,0.95)] transition hover:bg-brand-500 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
