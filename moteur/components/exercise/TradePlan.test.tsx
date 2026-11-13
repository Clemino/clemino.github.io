import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { TradePlan } from "./TradePlan"

afterEach(cleanup)

const payload = { capital: 10000, direction: "long" as const, maxRiskPct: 1, minRR: 2 }

describe("TradePlan", () => {
  it("affiche le contexte du scénario", () => {
    render(<TradePlan payload={payload} values={{}} onChange={vi.fn()} disabled={false} />)
    expect(screen.getByText(/Capital : 10\s000 €/)).toBeInTheDocument()
    expect(screen.getByText("Risque max : 1 %")).toBeInTheDocument()
  })

  it("affiche les quatre champs du plan", () => {
    render(<TradePlan payload={payload} values={{}} onChange={vi.fn()} disabled={false} />)
    for (const label of ["Prix d'entrée", "Stop-loss", "Objectif", "Taille (unités)"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument()
    }
  })

  it("conserve les autres champs à la saisie", () => {
    const onChange = vi.fn()
    render(<TradePlan payload={payload} values={{ entry: "50" }} onChange={onChange} disabled={false} />)
    fireEvent.change(screen.getByLabelText("Stop-loss"), { target: { value: "48" } })
    expect(onChange).toHaveBeenCalledWith({ entry: "50", stop: "48" })
  })

  it("désactive les champs après validation", () => {
    render(<TradePlan payload={payload} values={{}} onChange={vi.fn()} disabled={true} />)
    expect(screen.getByLabelText("Objectif")).toBeDisabled()
  })
})
