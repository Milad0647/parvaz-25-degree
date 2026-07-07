"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ROTATING_TIPS } from "@/lib/game/constants";

const CAPTION_LABEL = "مصرف بهینه";

export function TipBanner() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % ROTATING_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tip-banner">
      <AnimatePresence mode="wait">
        <motion.div
          key={tipIndex}
          className="tip-banner-stack"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          <p className="tip-banner-text">{ROTATING_TIPS[tipIndex]}</p>
          <p className="tip-banner-caption">{CAPTION_LABEL}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
