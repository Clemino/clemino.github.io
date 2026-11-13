import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { DecisionTree } from "./DecisionTree"
import type { DecisionTreeNode } from "./types"

afterEach(cleanup)

const root: DecisionTreeNode = {
  type: "attribute",
  label: "Temps",
  branches: [
    { edgeLabel: "ensoleillé", child: { type: "leaf", label: "Oui" } },
    { edgeLabel: "pluvieux", child: { type: "leaf", label: "Non" } },
  ],
}

describe("DecisionTree", () => {
  it("rend l'arbre sans erreur", () => {
    const { container } = render(<DecisionTree root={root} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("affiche l'attribut testé et les classes prédites", () => {
    render(<DecisionTree root={root} />)
    expect(screen.getByText("Temps")).toBeInTheDocument()
    expect(screen.getByText("Oui")).toBeInTheDocument()
    expect(screen.getByText("Non")).toBeInTheDocument()
  })

  it("affiche les libellés d'arêtes (valeurs d'attribut)", () => {
    render(<DecisionTree root={root} />)
    expect(screen.getByText("ensoleillé")).toBeInTheDocument()
  })

  it("rend une feuille seule sans erreur", () => {
    const { container } = render(
      <DecisionTree root={{ type: "leaf", label: "Oui" }} />,
    )
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
