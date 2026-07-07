interface HUDProps {
  score: number;
  bestScore: number;
}

export function HUD({ score, bestScore }: HUDProps) {
  return (
    <div className="hud">
      <div>
        <div className="hud-score">{score}</div>
        {bestScore > 0 && (
          <div className="hud-best">رکورد: {bestScore}</div>
        )}
      </div>
    </div>
  );
}
