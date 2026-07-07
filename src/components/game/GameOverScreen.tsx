"use client";

import { motion } from "framer-motion";
import { getMedalForScore } from "@/lib/game/medals";

interface GameOverScreenProps {
  score: number;
  bestScore: number;
  deathMessage: string;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOverScreen({
  score,
  bestScore,
  deathMessage,
  onRestart,
  onMenu,
}: GameOverScreenProps) {
  const isNewRecord = score >= bestScore && score > 0;
  const medal = getMedalForScore(score);

  return (
    <motion.div
      className="overlay-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-col items-center gap-4 text-center max-w-sm w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
        >
          <span className="text-5xl">💡</span>
        </motion.div>

        <h2 className="text-2xl font-extrabold text-red-300">
          مسیر از ۲۵ درجه خارج شد
        </h2>

        <div className="bg-white/10 rounded-2xl px-6 py-4 w-full">
          <p className="text-white/60 text-sm mb-1">امتیاز شما</p>
          <p className="text-5xl font-extrabold text-yellow-300">{score}</p>
          {isNewRecord && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 text-sm font-bold mt-1"
            >
              رکورد جدید!
            </motion.p>
          )}
          <p className="text-white/50 text-sm mt-2">
            بهترین رکورد: {bestScore}
          </p>
        </div>

        {medal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-yellow-500/15 border border-yellow-400/40 rounded-xl px-4 py-3 w-full"
          >
            <p className="text-yellow-300 font-bold text-sm">
              {medal.emoji} {medal.title}
            </p>
            <p className="text-yellow-100/80 text-xs mt-1">{medal.description}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-900/50 border border-blue-400/30 rounded-xl px-4 py-3 w-full"
        >
          <p className="text-blue-100 text-sm leading-relaxed">{deathMessage}</p>
        </motion.div>

        <div className="flex flex-col gap-3 w-full mt-2">
          <motion.button
            className="btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
            whileTap={{ scale: 0.96 }}
          >
            دوباره تلاش کن
          </motion.button>

          <motion.button
            className="btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              onMenu();
            }}
            whileTap={{ scale: 0.96 }}
          >
            بازگشت
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
