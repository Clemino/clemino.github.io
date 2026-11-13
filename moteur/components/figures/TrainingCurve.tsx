"use client"

import type { CurveSeries } from "./types"
import { FigureFrame } from "./FigureFrame"

const W = 460 // plot area width
const H = 230 // plot area height
const ML = 48 // left margin (y axis)
const MR = 16 // right margin
const MT = 12 // top margin
const MB = 40 // bottom margin (x axis)
const TICKS = 4 // gridline count per axis

const TONE_VAR: Record<NonNullable<CurveSeries["tone"]>, string> = {
  accent: "var(--color-chart-1)",
  info: "var(--color-chart-2)",
  warning: "var(--color-chart-3)",
  success: "var(--color-chart-4)",
  error: "var(--color-chart-5)",
}

const FALLBACK_TONES = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

/** A line chart of one or more series over epochs for CNN / overfitting exercises. */
export function TrainingCurve({
  series,
  xLabel = "époque",
  yLabel = "erreur",
  caption,
}: {
  series: CurveSeries[]
  xLabel?: string
  yLabel?: string
  caption?: string
}) {
  const allPoints = series.flatMap((s) => s.points)
  const xs = allPoints.map((p) => p.x)
  const ys = allPoints.map((p) => p.y)

  const xMin = xs.length ? Math.min(...xs) : 0
  const xMaxRaw = xs.length ? Math.max(...xs) : 1
  const xMax = xMaxRaw === xMin ? xMin + 1 : xMaxRaw
  // Anchor at 0 for all-positive series; extend below 0 when any value is negative
  // so RL reward curves (or similar) are never clipped.
  const yMin = ys.length ? Math.min(0, Math.min(...ys)) : 0
  const yMaxRaw = ys.length ? Math.max(...ys) : 1
  const yMax = yMaxRaw === yMin ? yMin + 1 : yMaxRaw

  const sx = (x: number) => ML + ((x - xMin) / (xMax - xMin)) * W
  const sy = (y: number) => MT + H - ((y - yMin) / (yMax - yMin)) * H

  const totalW = ML + W + MR
  const totalH = MT + H + MB

  const fmt = (v: number) =>
    Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/, "")

  return (
    <FigureFrame label="Courbe d'apprentissage" caption={caption}>
      <svg
        width={totalW}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="block"
        role="img"
        aria-label="Courbe d'apprentissage"
      >
        {/* gridlines + axis ticks */}
        {Array.from({ length: TICKS + 1 }).map((_, i) => {
          const t = i / TICKS
          const y = MT + H - t * H
          const yVal = yMin + t * (yMax - yMin)
          const x = ML + t * W
          const xVal = xMin + t * (xMax - xMin)
          return (
            <g key={`grid-${i}`}>
              <line
                x1={ML}
                y1={y}
                x2={ML + W}
                y2={y}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={ML - 8}
                y={y + 3}
                textAnchor="end"
                fontSize={9.5}
                fontFamily="var(--font-mono)"
                fill="var(--fg-2)"
              >
                {fmt(yVal)}
              </text>
              <text
                x={x}
                y={MT + H + 16}
                textAnchor="middle"
                fontSize={9.5}
                fontFamily="var(--font-mono)"
                fill="var(--fg-2)"
              >
                {fmt(xVal)}
              </text>
            </g>
          )
        })}

        {/* axes */}
        <line
          x1={ML}
          y1={MT}
          x2={ML}
          y2={MT + H}
          stroke="var(--border-strong)"
          strokeWidth={1.5}
        />
        <line
          x1={ML}
          y1={MT + H}
          x2={ML + W}
          y2={MT + H}
          stroke="var(--border-strong)"
          strokeWidth={1.5}
        />

        {/* axis labels */}
        <text
          x={ML + W / 2}
          y={totalH - 4}
          textAnchor="middle"
          fontSize={10.5}
          fontFamily="var(--font-mono)"
          fill="var(--fg-1)"
        >
          {xLabel}
        </text>
        <text
          x={12}
          y={MT + H / 2}
          textAnchor="middle"
          fontSize={10.5}
          fontFamily="var(--font-mono)"
          fill="var(--fg-1)"
          transform={`rotate(-90 12 ${MT + H / 2})`}
        >
          {yLabel}
        </text>

        {/* series polylines + point dots */}
        {series.map((s, si) => {
          const color = s.tone ? TONE_VAR[s.tone] : FALLBACK_TONES[si % FALLBACK_TONES.length]
          const pts = [...s.points].sort((a, b) => a.x - b.x)
          const d = pts.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")
          return (
            <g key={`series-${si}`}>
              {pts.length > 1 && (
                <polyline
                  points={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}
              {pts.map((p, pi) => (
                <circle key={pi} cx={sx(p.x)} cy={sy(p.y)} r={2.6} fill={color} />
              ))}
            </g>
          )
        })}
      </svg>

      {/* legend */}
      {series.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {series.map((s, si) => {
            const color = s.tone
              ? TONE_VAR[s.tone]
              : FALLBACK_TONES[si % FALLBACK_TONES.length]
            return (
              <span
                key={si}
                className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--fg-1)]"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-[2px]"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                {s.label}
              </span>
            )
          })}
        </div>
      )}
    </FigureFrame>
  )
}
