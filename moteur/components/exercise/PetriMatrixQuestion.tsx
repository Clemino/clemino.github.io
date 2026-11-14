"use client"

import { MatrixGrid } from "@/components/petri/MatrixGrid"
import { PetriNetViewer } from "@/components/petri/PetriNetViewer"
import type { PetriMatrixPayload } from "@/lib/validators/types"

export function PetriMatrixQuestion({
  payload,
  matrix,
  onChange,
  disabled,
}: {
  payload: PetriMatrixPayload
  matrix: Record<string, Record<string, number>>
  onChange: (value: Record<string, Record<string, number>>) => void
  disabled: boolean
}) {
  return (
    <div className="space-y-4">
      <PetriNetViewer
        places={payload.places}
        transitions={payload.transitions}
        arcs={payload.arcs}
        marking={payload.marking}
      />
      <div>
        <div className="mono-label mb-2">
          Completer la matrice{" "}
          {payload.matrix === "incidence" ? "C = Post - Pre" : payload.matrix}
        </div>
        <MatrixGrid
          places={payload.places}
          transitions={payload.transitions}
          values={matrix}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
