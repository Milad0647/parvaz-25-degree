"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  bestScore: number;
  onStart: () => void;
}

export function StartScreen({ bestScore, onStart }: StartScreenProps) {
  return (
    <motion.div
      className="overlay-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        {/* Lamp icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mb-2"
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <ellipse cx="40" cy="44" rx="22" ry="26" fill="#FFD54F" />
            <ellipse cx="40" cy="44" rx="16" ry="20" fill="#FFF9C4" />
            <rect x="34" y="66" width="12" height="8" rx="2" fill="#9E9E9E" />
            <ellipse cx="22" cy="38" rx="12" ry="6" fill="#90CAF9" transform="rotate(-15 22 38)" />
            <ellipse cx="58" cy="38" rx="12" ry="6" fill="#90CAF9" transform="rotate(15 58 38)" />
            <circle cx="33" cy="40" r="3" fill="#1A237E" />
            <circle cx="47" cy="40" r="3" fill="#1A237E" />
            <path d="M36 50 Q40 54 44 50" stroke="#1A237E" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>

        <h1 className="text-3xl font-extrabold text-yellow-300 leading-tight">
          پرواز ۲۵ درجه
        </h1>
        <p className="text-blue-200 text-base font-medium max-w-xs">
          مسیر روشنایی از ۲۵ درجه می‌گذرد
        </p>

        {bestScore > 0 && (
          <p className="text-white/60 text-sm">
            بهترین رکورد: <span className="text-yellow-300 font-bold">{bestScore}</span>
          </p>
        )}

        <motion.button
          className="btn-primary mt-4"
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          شروع پرواز
        </motion.button>

        <p className="text-white/50 text-xs max-w-xs mt-2 leading-relaxed">
          با تنظیم درست مصرف، روشنایی برای همه ادامه پیدا می‌کند
        </p>
      </motion.div>
    </motion.div>
  );
}
