import { describe, expect, it } from "vitest"
import { canonicalSolution, describeSubmission } from "./canonical"

const mcq = { options: [{ id: "a", label: "Conseil d'État" }, { id: "b", label: "Tribunal des conflits" }] }

describe("canonicalSolution", () => {
  it("prints labels rather than option ids", () => {
    expect(canonicalSolution("MCQ_SINGLE", mcq, { correct: ["b"] })).toBe("Tribunal des conflits")
  })

  it("lists an ordering in the expected order", () => {
    const payload = { items: [{ id: "a", label: "Conclusion" }, { id: "b", label: "Majeure" }] }
    expect(canonicalSolution("ORDERING", payload, { order: ["b", "a"] })).toBe("1. Majeure\n2. Conclusion")
  })

  it("answers each sub-question of a case study", () => {
    const payload = {
      scenario: "Faits",
      subQuestions: [
        { id: "q1", type: "MCQ_SINGLE" as const, prompt: "Juge ?", payload: mcq },
        { id: "q2", type: "TRUE_FALSE" as const, prompt: "Recevable ?", payload: {} },
      ],
    }
    const solution = {
      subSolutions: [
        { id: "q1", solution: { correct: ["a"] } },
        { id: "q2", solution: { value: true } },
      ],
    }
    expect(canonicalSolution("CASE_STUDY", payload, solution)).toBe("Q1. Conseil d'État\nQ2. Vrai")
  })
})

describe("describeSubmission", () => {
  it("prints the labels the student picked", () => {
    expect(describeSubmission("MCQ_SINGLE", mcq, { selected: ["a"] })).toBe("Conseil d'État")
  })

  it("prints the matches the student made", () => {
    const payload = { left: [{ id: "l", label: "Blanco" }], right: [{ id: "r", label: "1873" }] }
    expect(describeSubmission("MATCHING", payload, { pairs: { l: "r" } })).toBe("Blanco ↔ 1873")
  })

  it("says so when a sub-question has no answer", () => {
    const payload = {
      scenario: "Faits",
      subQuestions: [
        { id: "q1", type: "TRUE_FALSE" as const, prompt: "Recevable ?", payload: {} },
        { id: "q2", type: "TRUE_FALSE" as const, prompt: "Fondé ?", payload: {} },
      ],
    }
    expect(describeSubmission("CASE_STUDY", payload, { answers: { q1: { value: false } } })).toBe("Q1. Faux\nQ2. Non répondu")
  })

  it("handles an attempt saved without its answer", () => {
    expect(describeSubmission("MCQ_SINGLE", mcq)).toBe("Non répondu")
  })
})
