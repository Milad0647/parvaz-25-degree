"use client";

import { motion } from "framer-motion";
import { StartCharacterPreview } from "./StartCharacterPreview";

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
        <StartCharacterPreview />

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
