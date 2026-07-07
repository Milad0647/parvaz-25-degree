"use client";

import { motion } from "framer-motion";

interface TutorialScreenProps {
  onComplete: () => void;
}

const TIPS = [
  "با لمس صفحه بالا برو",
  "از شکاف ۲۵° عبور کن",
  "به بخش‌های پرمصرف برخورد نکن",
  "آیتم‌های مثبت را جمع کن",
];

export function TutorialScreen({ onComplete }: TutorialScreenProps) {
  return (
    <motion.div
      className="overlay-screen"
      style={{ zIndex: 20 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-6 text-center max-w-sm"
      >
        <h2 className="text-2xl font-bold text-yellow-300">راهنمای سریع</h2>

        <ul className="flex flex-col gap-3 w-full">
          {TIPS.map((tip, i) => (
            <motion.li
              key={tip}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 * i }}
              className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-white text-sm"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-yellow-400 text-blue-900 font-bold flex items-center justify-center text-xs">
                {i + 1}
              </span>
              {tip}
            </motion.li>
          ))}
        </ul>

        <motion.button
          className="btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          whileTap={{ scale: 0.96 }}
        >
          فهمیدم
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
