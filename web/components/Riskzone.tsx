interface RiskZoneProps {
  name: string;
  parish: string;
  score: number;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "var(--red-light)";
  if (score >= 60) return "var(--orange)";
  if (score >= 40) return "var(--yellow)";
  return "var(--green-light)";
}

export default function RiskZone({ name, parish, score }: RiskZoneProps) {
  const color = getScoreColor(score);

  return (
    <div className="risk-zone">
      <div>
        <div className="zone-name">{name}</div>
        <div className="zone-parish">{parish}</div>
      </div>
      <div className="risk-bar-wrap">
        <div
          className="risk-bar"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <div className="risk-score" style={{ color }}>
        {score}
      </div>
    </div>
  );
}
