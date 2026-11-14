import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { NeuralNetDiagram } from "./NeuralNetDiagram"
import type { NnLayer } from "./types"

afterEach(cleanup)

const layers: NnLayer[] = [
  { neurons: 3, role: "input" },
  { neurons: 4, role: "hidden" },
  { neurons: 2, role: "output" },
]

describe("NeuralNetDiagram", () => {
  it("rend le diagramme sans erreur", () => {
    const { container } = render(<NeuralNetDiagram layers={layers} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("dessine un cercle par neurone", () => {
    const { container } = render(<NeuralNetDiagram layers={layers} />)
    expect(container.querySelectorAll("circle")).toHaveLength(3 + 4 + 2)
  })

  it("affiche les libellés de couche par rôle", () => {
    render(<NeuralNetDiagram layers={layers} />)
    expect(screen.getByText("Couche entrée")).toBeInTheDocument()
    expect(screen.getByText("Couche sortie")).toBeInTheDocument()
  })

  it("affiche le nombre de neurones", () => {
    render(<NeuralNetDiagram layers={[{ neurons: 1, role: "input" }]} />)
    expect(screen.getByText("1 neurone")).toBeInTheDocument()
  })

  it("affiche la légende quand elle est fournie", () => {
    render(
      <NeuralNetDiagram layers={layers} caption="Perceptron multicouche" />
    )
    expect(screen.getByText("Perceptron multicouche")).toBeInTheDocument()
  })
})
