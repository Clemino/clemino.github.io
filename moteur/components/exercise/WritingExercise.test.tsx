import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { WritingExercise } from "./WritingExercise"

const payload = {
  modelAnswer: "Le corrigé détaillé",
  rubric: [
    { id: "a", label: "Une problématique" },
    { id: "b", label: "Un plan en deux parties" },
  ],
}

describe("WritingExercise", () => {
  it("hides the model answer until the student asks for it", () => {
    const onChange = vi.fn()
    render(<WritingExercise payload={payload} submission={null} onChange={onChange} disabled={false} />)
    expect(screen.queryByText("Le corrigé détaillé")).toBeNull()

    fireEvent.change(screen.getByLabelText("Ta copie"), { target: { value: "Ma copie" } })
    fireEvent.click(screen.getByRole("button"))
    expect(onChange).toHaveBeenCalledWith({ text: "Ma copie", checked: [] })
  })

  it("shows the model answer and records ticked criteria once opened", () => {
    const onChange = vi.fn()
    render(
      <WritingExercise
        payload={payload}
        submission={{ text: "Ma copie", checked: ["a"] }}
        onChange={onChange}
        disabled={false}
      />,
    )
    expect(screen.getByText("Le corrigé détaillé")).toBeTruthy()

    fireEvent.click(screen.getByLabelText("Un plan en deux parties"))
    expect(onChange).toHaveBeenCalledWith({ text: "Ma copie", checked: ["a", "b"] })
  })
})
