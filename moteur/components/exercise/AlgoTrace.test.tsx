import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { AlgoTrace } from "./AlgoTrace"
import type { AlgoTracePayload } from "@/lib/validators/types"

afterEach(cleanup)

const minimalPayload: AlgoTracePayload = {
  cells: [
    { id: "x", label: "Valeur de x" },
    { id: "n", label: "Compteur n", kind: "number" },
  ],
}

describe("AlgoTrace", () => {
  it("affiche les libellés des cellules", () => {
    render(
      <AlgoTrace
        payload={minimalPayload}
        values={{}}
        onChange={vi.fn()}
        disabled={false}
      />
    )
    expect(screen.getByText("Valeur de x")).toBeInTheDocument()
    expect(screen.getByText("Compteur n")).toBeInTheDocument()
  })

  it("affiche un input par cellule", () => {
    render(
      <AlgoTrace
        payload={minimalPayload}
        values={{}}
        onChange={vi.fn()}
        disabled={false}
      />
    )
    const inputs = screen.getAllByRole("textbox")
    expect(inputs).toHaveLength(2)
  })

  it("affiche les valeurs pré-remplies", () => {
    render(
      <AlgoTrace
        payload={minimalPayload}
        values={{ x: "hello", n: "7" }}
        onChange={vi.fn()}
        disabled={false}
      />
    )
    expect(screen.getByLabelText("Valeur de x")).toHaveValue("hello")
    expect(screen.getByLabelText("Compteur n")).toHaveValue("7")
  })

  it("désactive tous les inputs quand disabled est vrai", () => {
    render(
      <AlgoTrace
        payload={minimalPayload}
        values={{}}
        onChange={vi.fn()}
        disabled={true}
      />
    )
    for (const input of screen.getAllByRole("textbox")) {
      expect(input).toBeDisabled()
    }
  })

  it("affiche la description quand elle est fournie", () => {
    render(
      <AlgoTrace
        payload={{
          ...minimalPayload,
          description: "Tracez l'algorithme suivant",
        }}
        values={{}}
        onChange={vi.fn()}
        disabled={false}
      />
    )
    expect(screen.getByText("Tracez l'algorithme suivant")).toBeInTheDocument()
  })

  it("rend une figure FigureView quand payload.figure est défini", () => {
    const payloadWithFigure: AlgoTracePayload = {
      ...minimalPayload,
      figure: {
        kind: "data-table",
        columns: ["Étape", "Valeur"],
        rows: [["1", "42"]],
      },
    }
    render(
      <AlgoTrace
        payload={payloadWithFigure}
        values={{}}
        onChange={vi.fn()}
        disabled={false}
      />
    )
    // FigureView renders a header for data-table
    expect(screen.getByText("Jeu de données")).toBeInTheDocument()
  })

  it("rend sans figure quand payload.figure est absent", () => {
    render(
      <AlgoTrace
        payload={minimalPayload}
        values={{}}
        onChange={vi.fn()}
        disabled={false}
      />
    )
    // No figure header
    expect(screen.queryByText("Jeu de données")).toBeNull()
  })
})
