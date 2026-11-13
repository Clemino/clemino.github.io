import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { SubQuestionRenderer } from "./SubQuestionRenderer"
import type { SubQuestion } from "@/lib/validators/types"

afterEach(cleanup)

describe("SubQuestionRenderer — MCQ_SINGLE", () => {
  const sq: SubQuestion = {
    id: "sq-mcq-single",
    type: "MCQ_SINGLE",
    prompt: "Quelle option est correcte ?",
    payload: {
      options: [
        { id: "a", label: "Option Alpha" },
        { id: "b", label: "Option Beta" },
      ],
    },
  }

  it("rend les options MCQ_SINGLE sans erreur", () => {
    render(
      <SubQuestionRenderer
        subQuestion={sq}
        answer={undefined}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Option Alpha")).toBeInTheDocument()
    expect(screen.getByText("Option Beta")).toBeInTheDocument()
  })
})

describe("SubQuestionRenderer — MCQ_MULTI", () => {
  const sq: SubQuestion = {
    id: "sq-mcq-multi",
    type: "MCQ_MULTI",
    prompt: "Sélectionnez toutes les bonnes réponses",
    payload: {
      options: [
        { id: "x", label: "Choix X" },
        { id: "y", label: "Choix Y" },
        { id: "z", label: "Choix Z" },
      ],
    },
  }

  it("rend les options MCQ_MULTI sans erreur", () => {
    render(
      <SubQuestionRenderer
        subQuestion={sq}
        answer={undefined}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Choix X")).toBeInTheDocument()
    expect(screen.getByText("Choix Y")).toBeInTheDocument()
    expect(screen.getByText("Choix Z")).toBeInTheDocument()
  })
})

describe("SubQuestionRenderer — TRUE_FALSE", () => {
  const sq: SubQuestion = {
    id: "sq-tf",
    type: "TRUE_FALSE",
    prompt: "Cette affirmation est vraie.",
    payload: {},
  }

  it("rend les boutons Vrai et Faux sans erreur", () => {
    render(
      <SubQuestionRenderer
        subQuestion={sq}
        answer={undefined}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Vrai")).toBeInTheDocument()
    expect(screen.getByText("Faux")).toBeInTheDocument()
  })
})

describe("SubQuestionRenderer — FILL_BLANK", () => {
  const sq: SubQuestion = {
    id: "sq-fill",
    type: "FILL_BLANK",
    prompt: "Complétez la phrase.",
    payload: {
      template: "La précision est {{p}} et le rappel est {{r}}.",
      slots: [
        { id: "p", placeholder: "0.0 – 1.0" },
        { id: "r", placeholder: "0.0 – 1.0" },
      ],
    },
  }

  it("rend les inputs de complétion sans erreur", () => {
    render(
      <SubQuestionRenderer
        subQuestion={sq}
        answer={undefined}
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    const inputs = screen.getAllByRole("textbox")
    expect(inputs.length).toBeGreaterThanOrEqual(2)
  })
})
