"use client"

import { CheckIcon } from "lucide-react"
import { PetriNetViewer } from "@/components/petri/PetriNetViewer"
import type { PetriEnabledTransitionsPayload } from "@/lib/validators/types"
import { cn } from "@/lib/utils"

export function PetriEnabledTransitions({
  payload,
  selected,
  onChange,
  disabled,
}: {
  payload: PetriEnabledTransitionsPayload
  selected: string[]
  onChange: (value: string[]) => void
  disabled: boolean
}) {
  const toggle = (id: string) => {
    if (disabled) return
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    )
  }

  return (
    <div className="space-y-4">
      <PetriNetViewer
        places={payload.places}
        transitions={payload.transitions}
        arcs={payload.arcs}
        marking={payload.marking}
        selectedTransitionIds={selected}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        {payload.transitions.map((transition) => {
          const active = selected.includes(transition.id)
          return (
            <button
              key={transition.id}
              type="button"
              onClick={() => toggle(transition.id)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors",
                active
                  ? "border-[var(--accent)] bg-[var(--accent-dim)]/30"
                  : "border-[var(--border)] bg-[var(--bg-1)] hover:bg-[var(--bg-2)]"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-[4px] border",
                  active
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "border-[var(--border-strong)]"
                )}
              >
                {active && <CheckIcon className="size-3" strokeWidth={3} />}
              </span>
              <span className="font-mono text-sm">
                {transition.label ?? transition.id}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
