"use client"

import { MarkingTable } from "@/components/petri/MarkingTable"
import { PetriNetViewer } from "@/components/petri/PetriNetViewer"
import type { PetriFireSequencePayload } from "@/lib/validators/types"

export function PetriFireSequence({
  payload,
  marking,
  onChange,
  disabled,
}: {
  payload: PetriFireSequencePayload
  marking: Record<string, number>
  onChange: (value: Record<string, number>) => void
  disabled: boolean
}) {
  const initial = Object.fromEntries(
    payload.places.map((place) => [
      place.id,
      payload.marking?.[place.id] ?? place.tokens ?? 0,
    ])
  )

  return (
    <div className="space-y-4">
      <PetriNetViewer
        places={payload.places}
        transitions={payload.transitions}
        arcs={payload.arcs}
        marking={payload.marking}
      />
      <div className="rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-4 py-3">
        <div className="mono-label mb-2">Sequence imposee</div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
          <span>
            M0 = ({payload.places.map((p) => initial[p.id]).join(", ")})
          </span>
          {payload.sequence.map((transitionId, index) => (
            <span
              key={`${transitionId}-${index}`}
              className="inline-flex items-center gap-2"
            >
              <span className="text-[var(--fg-3)]">--</span>
              <span className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-2 py-1 text-[var(--accent)]">
                {transitionId}
              </span>
              <span className="text-[var(--fg-3)]">-&gt;</span>
            </span>
          ))}
          <span>M?</span>
        </div>
      </div>
      <div>
        <div className="mono-label mb-2">Marquage final a saisir</div>
        <MarkingTable
          places={payload.places}
          values={marking}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
