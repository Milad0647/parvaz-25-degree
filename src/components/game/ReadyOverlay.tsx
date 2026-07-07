"use client";

import { motion } from "framer-motion";

export function ReadyOverlay() {
  return (
    <div className="ready-overlay">
      <motion.img
        src="/icon/tap.webp"
        alt="برای شروع لمس کن"
        className="ready-tap-image"
        draggable={false}
        animate={{ y: [0, -12, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      />
    </div>
  );
}
