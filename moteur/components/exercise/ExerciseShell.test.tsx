import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { ExerciseShell } from "./ExerciseShell"
import type { Exercise } from "@/lib/course"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock("@/lib/confetti", () => ({ celebratePass: vi.fn() }))
vi.mock("@/components/use-progress", () => ({
  useProgress: () => ({
    passedExercises: new Set<string>(),
    modules: [
      {
        slug: "m1",
        chapters: [
          { slug: "c1", order: 1 },
          { slug: "c2", order: 2 },
        ],
      },
    ],
    chapters: { c1: { completed: true } },
  }),
}))

afterEach(cleanup)

const exercise: Exercise = {
  id: "e1",
  moduleSlug: "m1",
  chapterSlug: "c1",
  type: "MCQ_SINGLE",
  difficulty: 1,
  points: 1,
  prompt: "Quel arrêt ?",
  payload: {
    options: [
      { id: "a", label: "Cadot" },
      { id: "b", label: "Blanco" },
    ],
  },
  solution: { correct: ["a"] },
  explanation: "Explication qui cite la solution.",
  hint: "Un rappel sans la solution.",
  concepts: [],
  source: null,
}

const answer = async (label: string) => {
  fireEvent.click(screen.getByRole("radio", { name: new RegExp(label) }))
  fireEvent.click(screen.getByRole("button", { name: "Vérifier" }))
  return screen.findByRole("dialog")
}

describe("ExerciseShell", () => {
  it("links to the course instead of revealing the solution", () => {
    render(
      <ExerciseShell exercise={exercise} courseHref="/cours?exercice=e1" />
    )
    expect(
      screen.getByRole("link", { name: "Revoir le cours" })
    ).toHaveAttribute("href", "/cours?exercice=e1")
    expect(screen.queryByText(/Révéler/)).toBeNull()
  })

  it("keeps the answer hidden after a wrong try, then lets the student retry", async () => {
    render(<ExerciseShell exercise={exercise} courseHref="/cours" />)
    await answer("Blanco")
    expect(screen.getByText("Un rappel sans la solution.")).toBeInTheDocument()
    expect(screen.queryByText("Explication qui cite la solution.")).toBeNull()

    fireEvent.click(screen.getByRole("button", { name: "Réessayer" }))
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(screen.getByRole("button", { name: "Vérifier" })).toBeDisabled()
  })

  it("leads to the next chapter once the last exercise of a finished chapter is right", async () => {
    render(<ExerciseShell exercise={exercise} courseHref="/cours" />)
    await answer("Cadot")
    expect(
      screen.getByText("Explication qui cite la solution.")
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole("link", { name: /Chapitre suivant/ })[0]
    ).toHaveAttribute("href", "/modules/m1/chapter/c2")
  })
})
