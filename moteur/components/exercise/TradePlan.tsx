"use client"

import { FigureView } from "@/components/figures/FigureView"
import type { TradePlanFields, TradePlanPayload, TradePlanSubmission } from "@/lib/validators/types"

const FIELDS: { id: keyof TradePlanFields; label: string; placeholder: string }[] = [
  { id: "entry", label: "Prix d'entrée", placeholder: "ex: 50" },
  { id: "stop", label: "Stop-loss", placeholder: "ex: 48" },
  { id: "target", label: "Objectif", placeholder: "ex: 54" },
  { id: "size", label: "Taille (unités)", placeholder: "ex: 50" },
]

export function TradePlan({
  payload,
  values,
  onChange,
  disabled,
}: {
  payload: TradePlanPayload
  values: TradePlanSubmission["values"]
  onChange: (v: TradePlanSubmission["values"]) => void
  disabled: boolean
}) {
  const safeValues = values ?? {}
  const cur = payload.currency ?? "€"

  return (
    <div className="space-y-4">
      {payload.figure && <FigureView spec={payload.figure} />}

      <div className="flex flex-wrap gap-x-5 gap-y-1 rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-4 py-3 font-mono text-xs text-[var(--fg-1)]">
        <span>Capital : {payload.capital.toLocaleString("fr-FR")} {cur}</span>
        <span>Sens : {payload.direction === "long" ? "achat (long)" : "vente (short)"}</span>
        <span>Risque max : {payload.maxRiskPct} %</span>
        <span>R/R min : {payload.minRR}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FIELDS.map((f) => (
          <div key={f.id} className="flex flex-col gap-1 rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-3">
            <label htmlFor={`trade-plan-${f.id}`} className="text-xs font-medium text-[var(--fg-2)]">
              {f.label}
            </label>
            <input
              id={`trade-plan-${f.id}`}
              type="text"
              inputMode="decimal"
              value={safeValues[f.id] ?? ""}
              onChange={(e) => onChange({ ...safeValues, [f.id]: e.target.value })}
              disabled={disabled}
              placeholder={f.placeholder}
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5 font-mono text-[13px] text-[var(--fg-0)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
