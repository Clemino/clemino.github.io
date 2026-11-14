"use client"

import type { PetriPlace, PetriTransition } from "@/lib/validators/types"

export function MatrixGrid({
  places,
  transitions,
  values,
  onChange,
  disabled,
}: {
  places: PetriPlace[]
  transitions: PetriTransition[]
  values: Record<string, Record<string, number>>
  onChange?: (values: Record<string, Record<string, number>>) => void
  disabled?: boolean
}) {
  const editable = Boolean(onChange)
  const update = (placeId: string, transitionId: string, value: string) => {
    if (!onChange) return
    onChange({
      ...values,
      [placeId]: {
        ...(values[placeId] ?? {}),
        [transitionId]: Number(value),
      },
    })
  }

  return (
    <div className="overflow-x-auto rounded-md border border-[var(--border)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--bg-2)]">
            <th className="border-b border-[var(--border)] px-3 py-2 text-left font-mono text-xs">
              Place
            </th>
            {transitions.map((transition) => (
              <th
                key={transition.id}
                className="border-b border-[var(--border)] px-3 py-2 text-center font-mono text-xs"
              >
                {transition.label ?? transition.id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {places.map((place) => (
            <tr key={place.id} className="border-t border-[var(--border)]">
              <td className="px-3 py-2 font-mono text-xs text-[var(--fg-2)]">
                {place.label ?? place.id}
              </td>
              {transitions.map((transition) => (
                <td key={transition.id} className="px-2 py-2 text-center">
                  {editable ? (
                    <input
                      type="number"
                      value={values[place.id]?.[transition.id] ?? 0}
                      onChange={(e) =>
                        update(place.id, transition.id, e.target.value)
                      }
                      disabled={disabled}
                      className="h-8 w-16 rounded border border-[var(--border)] bg-[var(--bg-1)] px-2 text-center font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    />
                  ) : (
                    <span className="font-mono tabular-nums">
                      {values[place.id]?.[transition.id] ?? 0}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
