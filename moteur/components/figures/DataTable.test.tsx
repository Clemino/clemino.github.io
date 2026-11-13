import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { DataTable } from "./DataTable"

afterEach(cleanup)

const columns = ["Âge", "Revenu", "Achat"]
const rows: (string | number)[][] = [
  [25, "faible", "non"],
  [42, "élevé", "oui"],
]

describe("DataTable", () => {
  it("rend la table sans erreur", () => {
    const { container } = render(<DataTable columns={columns} rows={rows} />)
    expect(container.querySelector("table")).toBeInTheDocument()
  })

  it("affiche les en-têtes de colonnes", () => {
    render(<DataTable columns={columns} rows={rows} />)
    expect(screen.getByText("Âge")).toBeInTheDocument()
    expect(screen.getByText("Achat")).toBeInTheDocument()
  })

  it("affiche les cellules des lignes", () => {
    render(<DataTable columns={columns} rows={rows} />)
    expect(screen.getByText("élevé")).toBeInTheDocument()
    expect(screen.getByText("oui")).toBeInTheDocument()
  })

  it("applique un fond aux lignes surlignées", () => {
    const { container } = render(
      <DataTable columns={columns} rows={rows} highlightRows={[0]} />,
    )
    const bodyRows = container.querySelectorAll("tbody tr")
    expect((bodyRows[0] as HTMLElement).style.backgroundColor).toBe("var(--accent-dim)")
    expect((bodyRows[1] as HTMLElement).style.backgroundColor).toBe("")
  })

  it("affiche la légende quand elle est fournie", () => {
    render(<DataTable columns={columns} rows={rows} caption="Jeu d'apprentissage" />)
    expect(screen.getByText("Jeu d'apprentissage")).toBeInTheDocument()
  })
})
