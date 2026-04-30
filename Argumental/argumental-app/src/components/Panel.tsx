import type { ReactNode } from "react";

interface PanelProps {
  /** Optional uppercase label strip rendered along the top of the panel. */
  label?: string;
  /** Light = white surface on light body; dark = zinc-900 surface for dashboards. */
  variant?: "light" | "dark";
  className?: string;
  children: ReactNode;
}

/**
 * Panel — a single instrument-panel surface used everywhere on the site.
 *
 * Hairline border + tight radius + optional uppercase label strip. Pads
 * are NOT applied to children — surface is opaque, you handle interior
 * spacing per usage.
 */
export default function Panel({
  label,
  variant = "light",
  className = "",
  children,
}: PanelProps) {
  const isLight = variant === "light";
  const surface = isLight
    ? "bg-white border-zinc-200"
    : "bg-zinc-900 border-zinc-800";
  const labelCls = isLight
    ? "bg-zinc-50 text-zinc-500 border-zinc-200"
    : "bg-zinc-950 text-zinc-400 border-zinc-800";

  return (
    <div
      className={`${surface} border rounded-md overflow-hidden ${className}`}
    >
      {label && (
        <div
          className={`${labelCls} border-b px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest`}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
