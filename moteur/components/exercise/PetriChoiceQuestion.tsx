"use client"

import { PetriNetViewer } from "@/components/petri/PetriNetViewer"
import { ReachabilityGraph } from "@/components/petri/ReachabilityGraph"
import { McqQuestion } from "./McqQuestion"
import type {
  PetriInvariantPayload,
  PetriPropertyPayload,
  PetriReachabilityPayload,
} from "@/lib/validators/types"

type ChoicePayload =
  | PetriPropertyPayload
  | PetriInvariantPayload
  | PetriReachabilityPayload

export function PetriChoiceQuestion({
  payload,
  selected,
  onChange,
  disabled,
  mode,
}: {
  payload: ChoicePayload
  selected: string[]
  onChange: (value: string[]) => void
  disabled: boolean
  mode: "single" | "multi"
}) {
  const options =
    "properties" in payload
      ? payload.properties
      : "vectors" in payload
        ? payload.vectors.map((vector) => ({
            id: vector.id,
            label: vector.label,
          }))
        : payload.options

  return (
    <div className="space-y-4">
      <PetriNetViewer
        places={payload.places}
        transitions={payload.transitions}
        arcs={payload.arcs}
        marking={payload.marking}
      />
      {"vectors" in payload && (
        <div className="grid gap-3 md:grid-cols-2">
          {payload.vectors.map((vector) => (
            <div
              key={vector.id}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-3"
            >
              <div className="mb-2 font-mono text-xs text-[var(--fg-2)]">
                {vector.label}
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {Object.entries(vector.values).map(([id, value]) => (
                  <span
                    key={id}
                    className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-2 py-1"
                  >
                    {id}={value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {"graph" in payload && payload.graph && (
        <ReachabilityGraph
          nodes={payload.graph.nodes}
          edges={payload.graph.edges}
        />
      )}
      <McqQuestion
        mode={mode}
        payload={{ options }}
        value={selected}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  )
}
