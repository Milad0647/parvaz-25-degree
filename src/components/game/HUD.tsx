interface HUDProps {
  score: number;
  isPaused: boolean;
  onPause: () => void;
}

export function HUD({ score, isPaused, onPause }: HUDProps) {
  return (
    <div className="hud-bar">
      <div className="hud-score-block">
        <img src="/icon/Star.webp" alt="" className="hud-star" draggable={false} />
        <span className="hud-score-value">{score}</span>
      </div>

      <img
        src="/icon/text.webp"
        alt="پرواز ۲۵ درجه"
        className="hud-title"
        draggable={false}
      />

      <button
        type="button"
        className="hud-pause-btn"
        onClick={(e) => {
          e.stopPropagation();
          onPause();
        }}
        aria-label={isPaused ? "ادامه بازی" : "توقف بازی"}
      >
        <img src="/icon/puse.webp" alt="" draggable={false} />
      </button>
    </div>
  );
}
