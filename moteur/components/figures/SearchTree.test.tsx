import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { SearchTree } from "./SearchTree"

afterEach(cleanup)

const nodes = [
  { id: "S", label: "S", g: 0, h: 5 },
  { id: "A", label: "A", g: 2, h: 3 },
  { id: "G", label: "G", g: 6, h: 0 },
]
const edges = [
  { from: "S", to: "A", cost: 2 },
  { from: "A", to: "G", cost: 4 },
]

describe("SearchTree", () => {
  it("rend le graphe sans erreur", () => {
    const { container } = render(<SearchTree nodes={nodes} edges={edges} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("affiche les libellés des nœuds", () => {
    render(
      <SearchTree nodes={nodes} edges={edges} startId="S" goalIds={["G"]} />
    )
    expect(screen.getByText("S")).toBeInTheDocument()
    expect(screen.getByText("G")).toBeInTheDocument()
  })

  it("affiche les coûts g, h et f", () => {
    render(
      <SearchTree nodes={nodes} edges={edges} startId="S" goalIds={["G"]} />
    )
    // node A carries g=2 h=3, so its combined label is "g=2  h=3  f=5"
    expect(screen.getByText(/g=2\s+h=3\s+f=5/)).toBeInTheDocument()
    // node G carries g=6 h=0 — f=6 is unique to it
    expect(screen.getByText(/g=6\s+h=0\s+f=6/)).toBeInTheDocument()
  })

  it("rend sans erreur même sans arêtes", () => {
    const { container } = render(<SearchTree nodes={nodes} edges={[]} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
