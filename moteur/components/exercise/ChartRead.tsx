"use client"

import { CandlestickChart } from "@/components/figures/CandlestickChart"
import type {
  ChartReadPayload,
  ChartReadSubmission,
} from "@/lib/validators/types"
import { McqQuestion } from "./McqQuestion"

const INPUT_CLASS =
  "w-36 rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-3 py-2 font-mono text-[13px] text-[var(--fg-0)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50"

export function ChartRead({
  payload,
  submission,
  onChange,
  disabled,
}: {
  payload: ChartReadPayload
  submission: ChartReadSubmission | null
  onChange: (s: ChartReadSubmission) => void
  disabled: boolean
}) {
  const chartProps = {
    candles: payload.candles,
    overlays: payload.overlays,
    levels: payload.levels,
    showVolume: payload.showVolume,
    caption: payload.caption,
  }

  if (payload.mode === "candle") {
    const selected = submission?.candle ?? null
    return (
      <div className="space-y-2">
        <CandlestickChart
          {...chartProps}
          pick={{
            mode: "candle",
            selected,
            onPick: (candle) => onChange({ candle }),
            disabled,
          }}
        />
        <p className="font-mono text-xs text-[var(--fg-2)]">
          {selected
            ? `Bougie sélectionnée : n°${selected}`
            : "Clique sur une bougie du graphique."}
        </p>
      </div>
    )
  }

  if (payload.mode === "price") {
    const selected = submission?.price ?? null
    return (
      <div className="space-y-2">
        <CandlestickChart
          {...chartProps}
          pick={{
            mode: "price",
            selected,
            onPick: (price) => onChange({ price }),
            disabled,
          }}
        />
        <div className="flex items-center gap-2">
          <label
            htmlFor="chart-read-price"
            className="text-xs text-[var(--fg-2)]"
          >
            Clique sur le graphique ou saisis le prix :
          </label>
          <input
            id="chart-read-price"
            type="text"
            inputMode="decimal"
            value={selected ?? ""}
            onChange={(e) => {
              const raw = e.target.value.trim().replace(/,/g, ".")
              onChange({ price: raw === "" ? undefined : Number(raw) })
            }}
            disabled={disabled}
            placeholder="ex: 52.4"
            autoComplete="off"
            className={INPUT_CLASS}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <CandlestickChart {...chartProps} />
      <McqQuestion
        mode="single"
        payload={{ options: payload.options ?? [] }}
        value={submission?.selected ? [submission.selected] : []}
        onChange={(v) => onChange({ selected: v[0] })}
        disabled={disabled}
      />
    </div>
  )
}
