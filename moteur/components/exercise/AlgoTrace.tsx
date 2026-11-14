"use client"

import { cn } from "@/lib/utils"
import type { AlgoTracePayload } from "@/lib/validators/types"
import { FigureView } from "@/components/figures/FigureView"

export function AlgoTrace({
  payload,
  values,
  onChange,
  disabled,
}: {
  payload: AlgoTracePayload
  values: Record<string, string>
  onChange: (v: Record<string, string>) => void
  disabled: boolean
}) {
  const safeValues = values ?? {}
  const update = (id: string, val: string) =>
    onChange({ ...safeValues, [id]: val })

  return (
    <div className="space-y-4">
      {payload.figure && (
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-4">
          <FigureView spec={payload.figure} />
        </div>
      )}

      {payload.description && (
        <p className="text-sm text-[var(--fg-2)]">{payload.description}</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {payload.cells.map((cell) => (
          <div
            key={cell.id}
            className="flex flex-col gap-1 rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-3"
          >
            <label
              htmlFor={`algo-cell-${cell.id}`}
              className="text-xs font-medium text-[var(--fg-2)]"
            >
              {cell.label}
            </label>
            <input
              id={`algo-cell-${cell.id}`}
              type="text"
              inputMode={cell.kind === "number" ? "decimal" : "text"}
              value={safeValues[cell.id] ?? ""}
              onChange={(e) => update(cell.id, e.target.value)}
              disabled={disabled}
              placeholder={
                cell.placeholder ?? (cell.kind === "number" ? "0" : "…")
              }
              autoComplete="off"
              spellCheck={false}
              className={cn(
                "rounded-md border border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5 font-mono text-[13px] text-[var(--fg-0)] transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50",
                cell.kind === "number" ? "w-36" : "w-full"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
