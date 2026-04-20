"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-04-28T20:00:00-05:00"); // April 28 2026, 8 PM EST

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [t, setT] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex flex-col items-center pt-4 pointer-events-none">
      <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1.5">
        Words Fly At
      </p>
      <div className="flex items-end gap-2">
        {[
          { value: t.days, label: "Days" },
          { value: t.hours, label: "Hrs" },
          { value: t.minutes, label: "Min" },
          { value: t.seconds, label: "Sec" },
        ].map(({ value, label }, i) => (
          <div key={label} className="flex items-end gap-2">
            {i > 0 && <span className="text-white/40 font-black text-xl mb-1">:</span>}
            <div className="flex flex-col items-center">
              <span className="text-white font-black text-2xl md:text-3xl tabular-nums leading-none">
                {pad(value)}
              </span>
              <span className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
