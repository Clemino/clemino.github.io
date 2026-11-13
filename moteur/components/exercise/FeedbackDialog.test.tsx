import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { FeedbackDialog } from "./FeedbackDialog"
import type { Exercise } from "@/lib/course"

afterEach(cleanup)

const exercise: Exercise = {
  id: "e1",
  moduleSlug: "m1",
  chapterSlug: "c1",
  type: "MCQ_SINGLE",
  difficulty: 1,
  points: 1,
  prompt: "Question",
  payload: { options: [] },
  solution: { correct: ["a"] },
  explanation: "La bonne réponse est Cadot.",
  hint: "Repense à la fin du XIXe siècle.",
  concepts: [],
  source: "CM",
}

const show = (passed: boolean, score: number, onRetry: (() => void) | undefined = vi.fn()) =>
  render(
    <FeedbackDialog
      exercise={exercise}
      result={{ passed, score, feedback: [], reveal: { canonicalSolution: "Cadot", explanation: "" } }}
      open
      onOpenChange={vi.fn()}
      onRetry={onRetry}
      next={{ href: "/suite", label: "Exercice suivant" }}
      courseHref="/cours"
    />,
  )

describe("FeedbackDialog", () => {
  it("hides the answer after a wrong attempt and offers the course", () => {
    show(false, 0)
    expect(screen.getByText("Repense à la fin du XIXe siècle.")).toBeInTheDocument()
    expect(screen.queryByText(/Cadot/)).toBeNull()
    expect(screen.getByRole("link", { name: "Revoir le cours" })).toHaveAttribute("href", "/cours")
    expect(screen.getByRole("button", { name: "Réessayer" })).toBeInTheDocument()
  })

  it("shows the explanation and the next step after a right answer", () => {
    show(true, 1)
    expect(screen.getByText("La bonne réponse est Cadot.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Exercice suivant" })).toHaveAttribute("href", "/suite")
  })

  it("is green when validated, orange when partial and red when wrong", () => {
    show(true, 1)
    expect(screen.getByRole("dialog")).toHaveAttribute("data-tone", "success")
    cleanup()
    show(false, 0.5)
    expect(screen.getByRole("dialog")).toHaveAttribute("data-tone", "warning")
    cleanup()
    show(false, 0)
    expect(screen.getByRole("dialog")).toHaveAttribute("data-tone", "error")
  })

  it("moves on after a wrong answer when there is no retry, still without the answer", () => {
    render(
      <FeedbackDialog
        exercise={exercise}
        result={{ passed: false, score: 0, feedback: [], reveal: { canonicalSolution: "Cadot", explanation: "" } }}
        open
        onOpenChange={vi.fn()}
        next={{ onClick: vi.fn(), label: "Suivant" }}
        courseHref="/cours"
      />,
    )
    expect(screen.getByRole("button", { name: "Suivant" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Réessayer" })).toBeNull()
    expect(screen.queryByText(/Cadot/)).toBeNull()
  })

  it("reports a partial answer without revealing it", () => {
    show(false, 0.5)
    expect(screen.getByText("Presque : 50 %")).toBeInTheDocument()
    expect(screen.queryByText(/Cadot/)).toBeNull()
  })
})
