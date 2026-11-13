"use client"

import type { Candle } from "@/lib/ohlc"
import type { ChartLevel, ChartOverlay } from "./types"
import { FigureFrame } from "./FigureFrame"

const W = 520 // plot area width
const H = 240 // price plot height
const VH = 50 // volume plot height (when shown)
const ML = 52 // left margin (price axis)
const MR = 16
const MT = 12
const MB = 28 // bottom margin (candle numbers)
const TICKS = 4

const TONE_VAR: Record<NonNullable<ChartOverlay["tone"]>, string> = {
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
]

export type CandlePick =
  | {
      mode: "candle"
      selected: number | null
      onPick: (candleNumber: number) => void
      disabled?: boolean
    }
  | {
      mode: "price"
      selected: number | null
      onPick: (price: number) => void
      disabled?: boolean
    }

/**
 * Candlestick chart of fictitious OHLC data. Candles are numbered from 1 so
 * prompts can say "candle #12". With `pick`, the student can click a candle
 * or a price level (CHART_READ exercises).
 */
export function CandlestickChart({
  candles,
  overlays = [],
  levels = [],
  showVolume,
  caption,
  pick,
}: {
  candles: Candle[]
  overlays?: ChartOverlay[]
  levels?: ChartLevel[]
  showVolume?: boolean
  caption?: string
  pick?: CandlePick
}) {
  const withVolume =
    (showVolume ?? true) && candles.some((k) => k.v !== undefined)
  const prices = [
    ...candles.flatMap((k) => [k.h, k.l]),
    ...overlays.flatMap((o) => o.values.filter((v): v is number => v !== null)),
    ...levels.map((l) => l.price),
  ]
  const rawMin = prices.length ? Math.min(...prices) : 0
  const rawMax = prices.length ? Math.max(...prices) : 1
  const pad = (rawMax - rawMin || 1) * 0.05
  const yMin = rawMin - pad
  const yMax = rawMax + pad

  const n = Math.max(candles.length, 1)
  const step = W / n
  const bodyW = Math.max(2, Math.min(14, step * 0.6))
  const cx = (i: number) => ML + step * (i + 0.5)
  const sy = (p: number) => MT + H - ((p - yMin) / (yMax - yMin)) * H
  const priceAt = (y: number) => yMin + ((MT + H - y) / H) * (yMax - yMin)

  const volTop = MT + H + 8
  const vMax = Math.max(1, ...candles.map((k) => k.v ?? 0))
  const totalW = ML + W + MR
  const totalH = MT + H + (withVolume ? VH + 8 : 0) + MB
  const labelEvery = Math.max(1, Math.ceil(n / 12))
  const decimals = yMax - yMin < 5 ? 2 : yMax - yMin < 50 ? 1 : 0

  const interactive = pick && !pick.disabled

  function handlePriceClick(e: React.MouseEvent<SVGRectElement>) {
    if (!pick || pick.mode !== "price" || pick.disabled) return
    const rect = e.currentTarget.ownerSVGElement!.getBoundingClientRect()
    const y = ((e.clientY - rect.top) / rect.height) * totalH
    pick.onPick(Math.round(priceAt(y) * 100) / 100)
  }

  return (
    <FigureFrame label="Graphique en chandeliers" caption={caption}>
      <svg
        width={totalW}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="block"
        role="img"
        aria-label="Graphique en chandeliers"
      >
        {Array.from({ length: TICKS + 1 }).map((_, i) => {
          const p = yMin + (i / TICKS) * (yMax - yMin)
          return (
            <g key={`grid-${i}`}>
              <line
                x1={ML}
                y1={sy(p)}
                x2={ML + W}
                y2={sy(p)}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={ML - 6}
                y={sy(p) + 3}
                textAnchor="end"
                fontSize={9.5}
                fontFamily="var(--font-mono)"
                fill="var(--fg-2)"
              >
                {p.toFixed(decimals)}
              </text>
            </g>
          )
        })}

        {pick?.mode === "price" && (
          <rect
            data-testid="price-area"
            x={ML}
            y={MT}
            width={W}
            height={H}
            fill="transparent"
            style={{ cursor: interactive ? "crosshair" : "default" }}
            onClick={handlePriceClick}
          />
        )}

        {levels.map((l, i) => (
          <g key={`level-${i}`} pointerEvents="none">
            <line
              x1={ML}
              y1={sy(l.price)}
              x2={ML + W}
              y2={sy(l.price)}
              stroke={l.tone ? TONE_VAR[l.tone] : "var(--fg-2)"}
              strokeWidth={1.2}
              strokeDasharray="5 4"
            />
            {l.label && (
              <text
                x={ML + W - 4}
                y={sy(l.price) - 4}
                textAnchor="end"
                fontSize={9.5}
                fontFamily="var(--font-mono)"
                fill="var(--fg-1)"
              >
                {l.label}
              </text>
            )}
          </g>
        ))}

        {candles.map((k, i) => {
          const up = k.c >= k.o
          const color = up ? "var(--success)" : "var(--error)"
          const top = sy(Math.max(k.o, k.c))
          const bodyH = Math.max(1, Math.abs(sy(k.o) - sy(k.c)))
          const selected = pick?.mode === "candle" && pick.selected === i + 1
          return (
            <g
              key={`candle-${i}`}
              data-testid={`candle-${i + 1}`}
              onClick={
                pick?.mode === "candle" && interactive
                  ? () => pick.onPick(i + 1)
                  : undefined
              }
              style={{
                cursor:
                  pick?.mode === "candle" && interactive
                    ? "pointer"
                    : "default",
              }}
              pointerEvents={pick?.mode === "price" ? "none" : undefined}
            >
              {pick?.mode === "candle" && (
                <rect
                  x={cx(i) - step / 2}
                  y={MT}
                  width={step}
                  height={H}
                  fill={selected ? "var(--accent)" : "transparent"}
                  opacity={selected ? 0.18 : 1}
                />
              )}
              <line
                x1={cx(i)}
                y1={sy(k.h)}
                x2={cx(i)}
                y2={sy(k.l)}
                stroke={color}
                strokeWidth={1.2}
              />
              <rect
                x={cx(i) - bodyW / 2}
                y={top}
                width={bodyW}
                height={bodyH}
                fill={up ? "var(--bg-1)" : color}
                stroke={color}
                strokeWidth={1.2}
              />
              {withVolume && k.v !== undefined && (
                <rect
                  x={cx(i) - bodyW / 2}
                  y={volTop + VH - (k.v / vMax) * VH}
                  width={bodyW}
                  height={(k.v / vMax) * VH}
                  fill={color}
                  opacity={0.45}
                />
              )}
              {(i % labelEvery === 0 || i === n - 1) && (
                <text
                  x={cx(i)}
                  y={totalH - MB + 16}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                  fill="var(--fg-2)"
                >
                  {i + 1}
                </text>
              )}
            </g>
          )
        })}

        {overlays.map((o, oi) => {
          const color = o.tone
            ? TONE_VAR[o.tone]
            : FALLBACK_TONES[oi % FALLBACK_TONES.length]
          const pts = o.values
            .map((v, i) => (v === null ? null : `${cx(i)},${sy(v)}`))
            .filter((p): p is string => p !== null)
          return pts.length > 1 ? (
            <polyline
              key={`overlay-${oi}`}
              points={pts.join(" ")}
              fill="none"
              stroke={color}
              strokeWidth={1.6}
              pointerEvents="none"
            />
          ) : null
        })}

        {pick?.mode === "price" && pick.selected !== null && (
          <g pointerEvents="none">
            <line
              x1={ML}
              y1={sy(pick.selected)}
              x2={ML + W}
              y2={sy(pick.selected)}
              stroke="var(--accent)"
              strokeWidth={1.5}
            />
            <text
              x={ML + 4}
              y={sy(pick.selected) - 4}
              fontSize={10}
              fontFamily="var(--font-mono)"
              fill="var(--accent)"
            >
              {pick.selected}
            </text>
          </g>
        )}

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
      </svg>

      {overlays.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {overlays.map((o, oi) => (
            <span
              key={oi}
              className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--fg-1)]"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-[2px]"
                style={{
                  backgroundColor: o.tone
                    ? TONE_VAR[o.tone]
                    : FALLBACK_TONES[oi % FALLBACK_TONES.length],
                }}
                aria-hidden="true"
              />
              {o.label}
            </span>
          ))}
        </div>
      )}
    </FigureFrame>
  )
}
