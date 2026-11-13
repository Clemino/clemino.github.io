import { describe, expect, it } from "vitest"
import { validateCaseStudy } from "./caseStudy"
import type { CaseStudyPayload } from "./types"

const payload: CaseStudyPayload = {
  scenario: "Faits",
  subQuestions: [
    {
      id: "q1",
      type: "MCQ_SINGLE",
      prompt: "Quel juge ?",
      payload: {
        options: [
          { id: "a", label: "Juge administratif" },
          { id: "b", label: "Juge judiciaire" },
        ],
      },
    },
    { id: "q2", type: "TRUE_FALSE", prompt: "Le recours est recevable.", payload: {} },
  ],
}
const solution = {
  subSolutions: [
    { id: "q1", solution: { correct: ["b"] } },
    { id: "q2", solution: { value: false } },
  ],
}

describe("validateCaseStudy", () => {
  it("passes when every sub-question is right", () => {
    const r = validateCaseStudy(
      payload,
      solution,
      { answers: { q1: { selected: ["b"] }, q2: { value: false } } },
      "",
    )
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
  })

  it("gives partial credit and names the expected label", () => {
    const r = validateCaseStudy(
      payload,
      solution,
      { answers: { q1: { selected: ["a"] }, q2: { value: false } } },
      "",
    )
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0.5)
    expect(r.reveal.canonicalSolution).toContain("Juge judiciaire")
  })

  it("does not treat an unanswered sub-question as false", () => {
    const r = validateCaseStudy(payload, solution, { answers: { q1: { selected: ["b"] } } }, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0.5)
  })
})
