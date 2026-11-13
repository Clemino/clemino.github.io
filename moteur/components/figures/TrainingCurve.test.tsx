import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { TrainingCurve } from "./TrainingCurve"
import type { CurveSeries } from "./types"

afterEach(cleanup)

const series: CurveSeries[] = [
  {
    label: "erreur d'apprentissage",
    tone: "accent",
    points: [
      { x: 0, y: 0.8 },
      { x: 1, y: 0.4 },
      { x: 2, y: 0.2 },
    ],
  },
  {
    label: "erreur de test",
    tone: "error",
    points: [
      { x: 0, y: 0.9 },
      { x: 1, y: 0.6 },
      { x: 2, y: 0.55 },
    ],
  },
]

describe("TrainingCurve", () => {
  it("rend le graphique sans erreur", () => {
    const { container } = render(<TrainingCurve series={series} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("dessine une polyligne par série", () => {
    const { container } = render(<TrainingCurve series={series} />)
    expect(container.querySelectorAll("polyline")).toHaveLength(2)
  })

  it("affiche la légende avec les libellés de série", () => {
    render(<TrainingCurve series={series} />)
    expect(screen.getByText("erreur d'apprentissage")).toBeInTheDocument()
    expect(screen.getByText("erreur de test")).toBeInTheDocument()
  })

  it("affiche les libellés d'axes", () => {
    render(<TrainingCurve series={series} xLabel="époque" yLabel="perte" />)
    expect(screen.getByText("époque")).toBeInTheDocument()
    expect(screen.getByText("perte")).toBeInTheDocument()
  })

  it("rend sans erreur avec une série vide", () => {
    const { container } = render(<TrainingCurve series={[]} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
