"use client"

import type { NumericPayload } from "@/lib/validators/types"

export function NumericInput({
  payload,
  value,
  onChange,
  disabled,
}: {
  payload: NumericPayload
  value: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  return (
    <div className="space-y-2">
      {payload.hint && (
        <p className="text-sm text-[var(--fg-2)]">{payload.hint}</p>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={payload.placeholder ?? "Entrez un nombre…"}
          autoComplete="off"
          spellCheck={false}
          aria-label={
            payload.unit
              ? `Réponse numérique (${payload.unit})`
              : "Réponse numérique"
          }
          className="w-48 rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-3 py-2 font-mono text-[13px] text-[var(--fg-0)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50"
        />
        {payload.unit && (
          <span className="font-mono text-[13px] text-[var(--fg-2)]">
            {payload.unit}
          </span>
        )}
      </div>
    </div>
  )
}
