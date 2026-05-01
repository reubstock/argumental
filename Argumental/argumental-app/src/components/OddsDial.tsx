interface OddsDialProps {
  /** 0–100, pre-bout odds that side B (AGAINST / blue) wins. 50 = even. */
  oddsB: number;
}

/**
 * OddsDial — half-circle gauge with a needle leaning toward the favorite.
 *
 * Red half-arc on the left (side A), blue half-arc on the right (side B).
 * Needle angle is mapped from 0 (full-A, points hard left) → 100 (full-B,
 * points hard right). 50 = needle straight up.
 */
export default function OddsDial({ oddsB }: OddsDialProps) {
  const pct = Math.max(0, Math.min(100, oddsB));
  // Math angle: 180° = left (A), 90° = up (even), 0° = right (B).
  const angleDeg = 180 - 1.8 * pct;
  const angleRad = (angleDeg * Math.PI) / 180;

  const cx = 50;
  const cy = 45;
  const length = 30;
  const tipX = cx + length * Math.cos(angleRad);
  const tipY = cy - length * Math.sin(angleRad);

  const favoredPct = Math.round(Math.max(pct, 100 - pct));
  const favoredColor = pct >= 50 ? "text-brand-blue" : "text-brand-red";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width="80"
        height="50"
        viewBox="0 0 100 60"
        className="overflow-visible"
        aria-label={`Odds: ${favoredPct}% favored`}
      >
        {/* Red half-arc (side A — left) */}
        <path
          d="M 10 50 A 40 40 0 0 1 50 10"
          stroke="#EB2C35"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Blue half-arc (side B — right) */}
        <path
          d="M 50 10 A 40 40 0 0 1 90 50"
          stroke="#1165C6"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Center tick */}
        <line
          x1="50"
          y1="6"
          x2="50"
          y2="14"
          stroke="#A1A1AA"
          strokeWidth="1.2"
        />
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={tipX}
          y2={tipY}
          stroke="#0A0A0A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Pivot */}
        <circle cx={cx} cy={cy} r="3.5" fill="#0A0A0A" />
        <circle cx={cx} cy={cy} r="1.4" fill="#FFFFFF" />
      </svg>
      <span
        className={`text-[10px] font-black uppercase tracking-widest tabular-nums ${favoredColor}`}
      >
        {favoredPct}%
      </span>
    </div>
  );
}
