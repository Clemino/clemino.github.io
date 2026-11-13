import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { GameTree } from "./GameTree"
import type { GameTreeNode } from "./types"

afterEach(cleanup)

const root: GameTreeNode = {
  type: "max",
  children: [
    { type: "min", children: [{ type: "leaf", value: 3 }, { type: "leaf", value: 7 }] },
    { type: "min", children: [{ type: "leaf", value: 2 }, { type: "leaf", value: 9 }] },
  ],
}

describe("GameTree", () => {
  it("rend l'arbre sans erreur", () => {
    const { container } = render(<GameTree root={root} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("affiche les valeurs des feuilles", () => {
    render(<GameTree root={root} />)
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("9")).toBeInTheDocument()
  })

  it("rend un nœud feuille seul sans erreur", () => {
    const { container } = render(<GameTree root={{ type: "leaf", value: 5 }} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("affiche la légende quand elle est fournie", () => {
    render(<GameTree root={root} caption="Minimax" />)
    expect(screen.getByText("Minimax")).toBeInTheDocument()
  })

  it("nœud max/min sans valeur : rend sans erreur et n'affiche ni '?' ni 'undefined'", () => {
    // Internal max/min node with no value — should render an empty slot (triangle),
    // not a "?" placeholder or "undefined".
    const noValueRoot: GameTreeNode = {
      type: "max",
      children: [
        { type: "min", children: [{ type: "leaf", value: 1 }] },
      ],
    }
    const { container } = render(<GameTree root={noValueRoot} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
    expect(screen.queryByText("?")).not.toBeInTheDocument()
    expect(screen.queryByText("undefined")).not.toBeInTheDocument()
  })
})
