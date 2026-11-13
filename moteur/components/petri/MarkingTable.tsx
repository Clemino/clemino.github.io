"use client"

import type { PetriPlace } from "@/lib/validators/types"

export function MarkingTable({
  places,
  values,
  onChange,
  disabled,
}: {
  places: PetriPlace[]
  values: Record<string, number>
  onChange?: (values: Record<string, number>) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {places.map((place) => (
        <label
          key={place.id}
          className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-3 py-2"
        >
          <span className="font-mono text-xs text-[var(--fg-2)]">{place.label ?? place.id}</span>
          {onChange ? (
            <input
              type="number"
              min={0}
              value={values[place.id] ?? 0}
              onChange={(e) => onChange({ ...values, [place.id]: Number(e.target.value) })}
              disabled={disabled}
              className="h-8 w-16 rounded border border-[var(--border)] bg-[var(--bg-0)] px-2 text-center font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            />
          ) : (
            <span className="font-mono text-sm tabular-nums text-[var(--fg-0)]">{values[place.id] ?? 0}</span>
          )}
        </label>
      ))}
    </div>
  )
}
