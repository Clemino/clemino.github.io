import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { FigureInterpret } from "./FigureInterpret"
import type { FigureInterpretPayload } from "@/lib/validators/types"

afterEach(cleanup)

const basePayload: FigureInterpretPayload = {
  figure: {
    kind: "confusion-matrix",
    classes: ["Positif", "Négatif"],
    matrix: [
      [50, 10],
      [5, 35],
    ],
  },
  subQuestions: [],
}

const payloadWithSubQ: FigureInterpretPayload = {
  figure: {
    kind: "data-table",
    columns: ["x", "y"],
    rows: [[1, 2], [3, 4]],
    caption: "Données d'entraînement",
  },
  caption: "Interprétez ce tableau",
  subQuestions: [
    {
      id: "sq1",
      type: "MCQ_SINGLE",
      prompt: "Combien y a-t-il de lignes ?",
      payload: {
        options: [
          { id: "a", label: "1" },
          { id: "b", label: "2" },
          { id: "c", label: "3" },
        ],
      },
    },
    {
      id: "sq2",
      type: "NUMERIC",
      prompt: "Quelle est la valeur maximale de y ?",
      payload: { unit: "pts" },
    },
  ],
}

describe("FigureInterpret", () => {
  it("affiche la figure via FigureView (matrice de confusion)", () => {
    render(
      <FigureInterpret
        payload={basePayload}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Matrice de confusion")).toBeInTheDocument()
  })

  it("affiche la légende de la figure quand elle est fournie", () => {
    render(
      <FigureInterpret
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Interprétez ce tableau")).toBeInTheDocument()
  })

  it("affiche les numéros de sous-questions", () => {
    render(
      <FigureInterpret
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Q1.")).toBeInTheDocument()
    expect(screen.getByText("Q2.")).toBeInTheDocument()
  })

  it("affiche le prompt des sous-questions", () => {
    render(
      <FigureInterpret
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Combien y a-t-il de lignes ?")).toBeInTheDocument()
    expect(screen.getByText("Quelle est la valeur maximale de y ?")).toBeInTheDocument()
  })

  it("affiche les options MCQ de la première sous-question", () => {
    render(
      <FigureInterpret
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    // Use getAllByText since the figure table also contains numeric text
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1)
  })

  it("affiche l'unité de la sous-question NUMERIC", () => {
    render(
      <FigureInterpret
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("pts")).toBeInTheDocument()
  })

  it("rend sans sous-questions sans erreur", () => {
    render(
      <FigureInterpret
        payload={basePayload}
        submission={null}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.queryByText("Q1.")).toBeNull()
  })

  it("désactive les inputs quand disabled est vrai", () => {
    render(
      <FigureInterpret
        payload={payloadWithSubQ}
        submission={null}
        onChange={vi.fn()}
        disabled={true}
      />,
    )
    for (const input of screen.getAllByRole("textbox")) {
      expect(input).toBeDisabled()
    }
  })

  it("restaure les réponses depuis la soumission initiale", () => {
    render(
      <FigureInterpret
        payload={payloadWithSubQ}
        submission={{ answers: { sq2: { value: "4" } } }}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByRole("textbox")).toHaveValue("4")
  })
})
