import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { CodeBlock } from "./CodeBlock"

afterEach(cleanup)

describe("CodeBlock", () => {
  it("affiche le code fourni", () => {
    render(<CodeBlock code={"print('hello')"} />)
    expect(screen.getByText("print('hello')")).toBeInTheDocument()
  })

  it("affiche le label de langage dans l'en-tête", () => {
    render(<CodeBlock code={"x = 1"} language="python" />)
    expect(screen.getByText("Python")).toBeInTheDocument()
  })

  it("affiche les numéros de ligne quand showLineNumbers est vrai", () => {
    render(<CodeBlock code={"a\nb\nc"} showLineNumbers />)
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("n'affiche pas les numéros de ligne quand showLineNumbers est faux", () => {
    render(<CodeBlock code={"a\nb"} showLineNumbers={false} />)
    // line numbers 1 and 2 should not appear
    expect(screen.queryByText("1")).toBeNull()
    expect(screen.queryByText("2")).toBeNull()
  })

  it("affiche les annotations pour les lignes concernées", () => {
    render(
      <CodeBlock
        code={"line1\nline2\nline3"}
        annotations={[{ line: 2, note: "important" }]}
      />
    )
    expect(screen.getByText("important")).toBeInTheDocument()
  })

  it("affiche le compteur de lignes dans l'en-tête", () => {
    render(<CodeBlock code={"a\nb\nc"} />)
    expect(screen.getByText("3 lignes")).toBeInTheDocument()
  })

  it("utilise le singulier pour une seule ligne", () => {
    render(<CodeBlock code={"seule ligne"} />)
    expect(screen.getByText("1 ligne")).toBeInTheDocument()
  })

  it("rend un bloc de code vide sans erreur", () => {
    render(<CodeBlock code={""} />)
    expect(screen.getByText("Code")).toBeInTheDocument()
  })

  // Issue 5(a): highlighted line has a different background style from a non-highlighted line
  it("applique un fond différent à la ligne surlignée", () => {
    const { container } = render(
      <CodeBlock code={"line1\nline2"} highlightLines={[1]} />
    )
    const rows = container.querySelectorAll("tbody tr")
    const highlightedRow = rows[0] as HTMLElement
    const normalRow = rows[1] as HTMLElement
    expect(highlightedRow.style.backgroundColor).not.toBe(
      normalRow.style.backgroundColor
    )
    expect(highlightedRow.style.backgroundColor).toBe("var(--accent-dim)")
    expect(normalRow.style.backgroundColor).toBe("")
  })

  // Issue 5(b): out-of-range highlightLines and annotations on non-existent lines render safely
  it("tolère des valeurs hors limites sans erreur ni ligne supplémentaire", () => {
    const { container } = render(
      <CodeBlock
        code={"line1\nline2"}
        highlightLines={[99]}
        annotations={[{ line: 99, note: "ghost" }]}
      />
    )
    // Only 2 rows, no extra row
    const rows = container.querySelectorAll("tbody tr")
    expect(rows).toHaveLength(2)
    // Ghost annotation must not appear
    expect(screen.queryByText("ghost")).toBeNull()
  })
})
