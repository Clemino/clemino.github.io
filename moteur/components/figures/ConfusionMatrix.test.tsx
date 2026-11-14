import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { ConfusionMatrix } from "./ConfusionMatrix"

afterEach(cleanup)

const classes = ["Positif", "Négatif"]
const matrix = [
  [40, 10],
  [5, 45],
]

describe("ConfusionMatrix", () => {
  it("rend la matrice sans erreur", () => {
    const { container } = render(
      <ConfusionMatrix classes={classes} matrix={matrix} />
    )
    expect(container.querySelector("table")).toBeInTheDocument()
  })

  it("affiche les axes Réel et Prédit", () => {
    render(<ConfusionMatrix classes={classes} matrix={matrix} />)
    expect(screen.getByText("Réel")).toBeInTheDocument()
    expect(screen.getByText("Prédit")).toBeInTheDocument()
  })

  it("affiche les valeurs de la matrice", () => {
    render(<ConfusionMatrix classes={classes} matrix={matrix} />)
    expect(screen.getByText("40")).toBeInTheDocument()
    expect(screen.getByText("45")).toBeInTheDocument()
  })

  it("met en évidence la diagonale avec l'accent", () => {
    const { container } = render(
      <ConfusionMatrix classes={classes} matrix={matrix} />
    )
    const bodyRows = container.querySelectorAll("tbody tr")
    // first data cell of the first row is on the diagonal
    const diagCell = bodyRows[0].querySelectorAll("td")[0] as HTMLElement
    expect(diagCell.style.backgroundColor).toBe("var(--accent-dim)")
  })

  it("affiche la légende quand elle est fournie", () => {
    render(
      <ConfusionMatrix classes={classes} matrix={matrix} caption="Évaluation" />
    )
    expect(screen.getByText("Évaluation")).toBeInTheDocument()
  })
})
