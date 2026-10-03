"use client";

import type { PointerEvent } from "react";
import { useId, useState } from "react";
import type { MonthlyPoint } from "@/lib/monthly-clothes-stats";

const WIDTH = 720;
const HEIGHT = 220;
const PAD_LEFT = 36;
const PAD_RIGHT = 16;
const PAD_TOP = 20;
const PAD_BOTTOM = 28;

// Rounds a max value up to a clean step (1/2/5 x 10^n) so the y-axis reads
// as a human would choose it, not a ratio of the data.
function niceMax(max: number): number {
  if (max <= 0) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

export function MonthlyLineChart({ data }: { data: MonthlyPoint[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const gradientId = useId();

  const max = niceMax(Math.max(...data.map((d) => d.total), 0));
  const yTicks = [0, max / 2, max];
  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const stepX = data.length > 1 ? plotWidth / (data.length - 1) : 0;

  const xAt = (i: number) => PAD_LEFT + stepX * i;
  const yAt = (v: number) => PAD_TOP + plotHeight - (v / max) * plotHeight;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(d.total)}`).join(" ");
  const areaPath = `${linePath} L ${xAt(data.length - 1)} ${PAD_TOP + plotHeight} L ${xAt(0)} ${PAD_TOP + plotHeight} Z`;

  const lastIndex = data.length - 1;
  const hovered = hoverIndex !== null ? data[hoverIndex] : null;

  function handlePointerMove(e: PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const i = Math.round((px - PAD_LEFT) / (stepX || 1));
    setHoverIndex(Math.min(Math.max(i, 0), lastIndex));
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full touch-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
        role="img"
        aria-label="Clothes donated per month"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines + y-axis ticks */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={yAt(t)}
              y2={yAt(t)}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text x={PAD_LEFT - 8} y={yAt(t)} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[10px]">
              {Math.round(t)}
            </text>
          </g>
        ))}

        {/* x-axis month labels, every other one if there are many */}
        {data.map((d, i) => {
          if (data.length > 8 && i % 2 !== 0 && i !== lastIndex) return null;
          return (
            <text
              key={d.key}
              x={xAt(i)}
              y={HEIGHT - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {d.label}
            </text>
          );
        })}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* crosshair */}
        {hovered && (
          <line
            x1={xAt(hoverIndex!)}
            x2={xAt(hoverIndex!)}
            y1={PAD_TOP}
            y2={PAD_TOP + plotHeight}
            stroke="var(--border)"
            strokeWidth="1"
          />
        )}

        {/* end marker + value label */}
        <circle cx={xAt(lastIndex)} cy={yAt(data[lastIndex].total)} r="5" fill="var(--primary)" stroke="var(--card)" strokeWidth="2" />
        <text
          x={xAt(lastIndex)}
          y={yAt(data[lastIndex].total) - 10}
          textAnchor="end"
          className="fill-foreground text-[11px] font-medium"
        >
          {data[lastIndex].total}
        </text>

        {/* hover marker */}
        {hovered && (
          <circle
            cx={xAt(hoverIndex!)}
            cy={yAt(hovered.total)}
            r="5"
            fill="var(--primary)"
            stroke="var(--card)"
            strokeWidth="2"
          />
        )}
      </svg>

      {hovered && hoverIndex !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-sm"
          style={{ left: `${(xAt(hoverIndex) / WIDTH) * 100}%` }}
        >
          <p className="font-semibold text-foreground">{hovered.total} items</p>
          <p className="text-muted-foreground">{hovered.label}</p>
        </div>
      )}
    </div>
  );
}
