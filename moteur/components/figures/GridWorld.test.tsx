import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { GridWorld } from "./GridWorld"
import type { GridCell } from "./types"

afterEach(cleanup)

const cells: GridCell[] = [
  { row: 0, col: 0, start: true },
  { row: 0, col: 1, wall: true },
  { row: 0, col: 2, reward: 1, terminal: true },
  { row: 1, col: 0, reward: -1, terminal: true },
  { row: 1, col: 2, policy: "up" },
]

describe("GridWorld", () => {
  it("rend la grille sans erreur", () => {
    const { container } = render(<GridWorld rows={2} cols={3} cells={cells} />)
    expect(container.querySelector('[role="grid"]')).toBeInTheDocument()
  })

  it("dessine une cellule par case", () => {
    const { container } = render(<GridWorld rows={2} cols={3} cells={cells} />)
    expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(6)
  })

  it("affiche le mur, le départ et la récompense", () => {
    render(<GridWorld rows={2} cols={3} cells={cells} />)
    expect(screen.getByText("mur")).toBeInTheDocument()
    expect(screen.getByText("départ")).toBeInTheDocument()
    expect(screen.getByText("+1")).toBeInTheDocument()
    expect(screen.getByText("-1")).toBeInTheDocument()
  })

  it("affiche une flèche de politique", () => {
    render(<GridWorld rows={2} cols={3} cells={cells} />)
    expect(screen.getByText("↑")).toBeInTheDocument()
  })

  it("affiche la légende quand elle est fournie", () => {
    render(<GridWorld rows={2} cols={3} cells={cells} caption="Grille 2×3" />)
    expect(screen.getByText("Grille 2×3")).toBeInTheDocument()
  })
})
