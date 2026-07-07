"use client";

import { motion } from "framer-motion";

export function PauseOverlay() {
  return (
    <motion.div
      className="pause-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="pause-overlay-text">مکث</p>
      <p className="pause-overlay-hint">برای ادامه لمس کن</p>
    </motion.div>
  );
}
