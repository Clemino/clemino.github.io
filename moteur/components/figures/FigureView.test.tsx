import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { FigureView } from "./FigureView"
import type { FigureSpec } from "./types"

afterEach(cleanup)

/** One minimal valid spec per `kind`, paired with text the figure must show. */
const cases: { spec: FigureSpec; expect: string }[] = [
  {
    spec: {
      kind: "game-tree",
      root: {
        type: "max",
        children: [{ type: "leaf", value: 4 }, { type: "leaf", value: 8 }],
      },
    },
    expect: "Arbre de jeu",
  },
  {
    spec: {
      kind: "search-tree",
      nodes: [
        { id: "S", label: "S" },
        { id: "G", label: "G" },
      ],
      edges: [{ from: "S", to: "G", cost: 1 }],
      startId: "S",
      goalIds: ["G"],
    },
    expect: "Arbre de recherche",
  },
  {
    spec: {
      kind: "decision-tree",
      root: {
        type: "attribute",
        label: "Temps",
        branches: [{ edgeLabel: "soleil", child: { type: "leaf", label: "Oui" } }],
      },
    },
    expect: "Arbre de décision",
  },
  {
    spec: {
      kind: "data-table",
      columns: ["A", "B"],
      rows: [[1, 2]],
    },
    expect: "Jeu de données",
  },
  {
    spec: {
      kind: "confusion-matrix",
      classes: ["P", "N"],
      matrix: [
        [1, 0],
        [0, 1],
      ],
    },
    expect: "Matrice de confusion",
  },
  {
    spec: {
      kind: "nn-diagram",
      layers: [
        { neurons: 2, role: "input" },
        { neurons: 1, role: "output" },
      ],
    },
    expect: "Réseau de neurones",
  },
  {
    spec: {
      kind: "training-curve",
      series: [
        {
          label: "erreur",
          points: [
            { x: 0, y: 1 },
            { x: 1, y: 0.5 },
          ],
        },
      ],
    },
    expect: "Courbe d'apprentissage",
  },
  {
    spec: {
      kind: "grid-world",
      rows: 1,
      cols: 2,
      cells: [{ row: 0, col: 0, start: true }],
    },
    expect: "Monde en grille",
  },
]

describe("FigureView", () => {
  for (const { spec, expect: label } of cases) {
    it(`rend la figure de type ${spec.kind}`, () => {
      render(<FigureView spec={spec} />)
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  }

  it("transmet la légende à la figure rendue", () => {
    render(
      <FigureView
        spec={{ kind: "data-table", columns: ["A"], rows: [[1]], caption: "Ma légende" }}
      />,
    )
    expect(screen.getByText("Ma légende")).toBeInTheDocument()
  })
})
