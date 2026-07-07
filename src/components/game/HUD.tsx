interface HUDProps {
  score: number;
  bestScore: number;
  phaseName: string;
}

export function HUD({ score, bestScore, phaseName }: HUDProps) {
  return (
    <div className="hud">
      <div>
        <div className="hud-score">{score}</div>
        {bestScore > 0 && (
          <div className="hud-best">رکورد: {bestScore}</div>
        )}
      </div>
      <div className="hud-phase">{phaseName}</div>
    </div>
  );
}
