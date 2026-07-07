"use client";

import { AnimatePresence, motion } from "framer-motion";

interface EncouragementToastProps {
  message: string | null;
}

export function EncouragementToast({ message }: EncouragementToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          exit={{ opacity: 0, y: -10, scale: 0.95, x: "-50%" }}
          transition={{ duration: 0.25 }}
          className="encouragement-toast"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
