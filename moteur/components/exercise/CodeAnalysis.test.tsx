import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { CodeAnalysis } from "./CodeAnalysis"
import type { CodeAnalysisPayload } from "@/lib/validators/types"

afterEach(cleanup)

const basePayload: CodeAnalysisPayload = {
  code: "x = 1\nprint(x)",
  language: "python",
  subQuestions: [],
}

const payloadWithSubQ: CodeAnalysisPayload = {
  code: "def f(n):\n    return n * 2",
  language: "python",
  caption: "Analysez cette fonction",
  subQuestions: [
    {
      id: "q1",
      type: "MCQ_SINGLE",
      prompt: "Que retourne f(3) ?",
      payload: {
        options: [
          { id: "a", label: "3" },
          { id: "b", label: "6" },
          { id: "c", label: "9" },
        ],
      },
    },
    {
      id: "q2",
      type: "TRUE_FALSE",
      prompt: "Cette fonction est récursive",
      payload: {},
    },
  ],
}

describe("CodeAnalysis", () => {
  it("affiche le bloc de code fourni dans le payload", () => {
    render(
      <CodeAnalysis
        payload={basePayload}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("x = 1")).toBeInTheDocument()
  })

  it("affiche la légende quand elle est fournie", () => {
    render(
      <CodeAnalysis
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Analysez cette fonction")).toBeInTheDocument()
  })

  it("n'affiche pas de légende quand elle est absente", () => {
    render(
      <CodeAnalysis
        payload={basePayload}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    // basePayload has no caption
    expect(screen.queryByRole("paragraph")).toBeNull()
  })

  it("affiche les numéros de sous-questions", () => {
    render(
      <CodeAnalysis
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Q1.")).toBeInTheDocument()
    expect(screen.getByText("Q2.")).toBeInTheDocument()
  })

  it("affiche le prompt de chaque sous-question via SubQuestionRenderer", () => {
    render(
      <CodeAnalysis
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Que retourne f(3) ?")).toBeInTheDocument()
    expect(screen.getByText("Cette fonction est récursive")).toBeInTheDocument()
  })

  it("affiche les options MCQ pour la première sous-question", () => {
    render(
      <CodeAnalysis
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("6")).toBeInTheDocument()
    expect(screen.getByText("9")).toBeInTheDocument()
  })

  it("affiche les boutons Vrai/Faux pour la sous-question TRUE_FALSE", () => {
    render(
      <CodeAnalysis
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Vrai")).toBeInTheDocument()
    expect(screen.getByText("Faux")).toBeInTheDocument()
  })

  it("rend sans sous-questions sans erreur", () => {
    render(
      <CodeAnalysis
        payload={basePayload}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.queryByText("Q1.")).toBeNull()
  })

  it("restaure les réponses depuis la soumission initiale", () => {
    render(
      <CodeAnalysis
        payload={payloadWithSubQ}
        submission={{ answers: { q1: { selected: ["b"] } } }}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    // Option b is selected (aria-checked=true)
    const option6 = screen.getByRole("radio", { name: /6/ })
    expect(option6).toHaveAttribute("aria-checked", "true")
  })
})
