"use client";

import { motion } from "framer-motion";

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

  return (
    <motion.div
      className="gameover-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img
        src="/icon/background.webp"
        alt=""
        className="gameover-bg"
        draggable={false}
      />
      <div className="gameover-bg-overlay" aria-hidden />

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="gameover-content"
      >
        <motion.img
          src="/icon/lamp.webp"
          alt=""
          className="gameover-lamp"
          draggable={false}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
        />

        <h2 className="gameover-title">مسیر از ۲۵ درجه خارج شد</h2>

        <div className="gameover-score-section">
          <div className="gameover-score-wrap">
            <img
              src="/icon/caption-score.webp"
              alt=""
              className="gameover-score-caption"
              draggable={false}
            />
            <span className="gameover-score-value">{score}</span>
          </div>
        </div>

        {isNewRecord && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="gameover-new-record"
          >
            رکورد جدید!
          </motion.p>
        )}

        <p className="gameover-best">بهترین رکورد: {bestScore}</p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gameover-message-block"
        >
          <div className="gameover-message-wrap">
            <img
              src="/icon/text-cap.webp"
              alt=""
              className="gameover-text-cap"
              draggable={false}
            />
            <div className="gameover-message-inner">
              <p className="gameover-message">{deathMessage}</p>
            </div>
          </div>
        </motion.div>

        <div className="gameover-actions">
          <motion.button
            type="button"
            className="gameover-img-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
            whileTap={{ scale: 0.96 }}
            aria-label="دوباره تلاش کن"
          >
            <img src="/icon/try-again.webp" alt="دوباره تلاش کن" draggable={false} />
          </motion.button>

          <motion.button
            type="button"
            className="gameover-img-btn"
            onClick={(e) => {
              e.stopPropagation();
              onMenu();
            }}
            whileTap={{ scale: 0.96 }}
            aria-label="بازگشت"
          >
            <img src="/icon/back.webp" alt="بازگشت" draggable={false} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
