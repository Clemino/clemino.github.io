import { describe, expect, it } from "vitest"
import { answerTexts, canonicalSolution, describeSubmission } from "./canonical"

describe("canonical answers of the other courses", () => {
  it("describes numeric answers with their unit", () => {
    expect(canonicalSolution("NUMERIC", { unit: "ms" }, { value: 3 })).toBe("3 ms")
    expect(describeSubmission("NUMERIC", { unit: "ms" }, { value: "4" })).toBe("4 ms")
  })

  it("describes a Petri marking", () => {
    const payload = { places: [], transitions: [], arcs: [], sequence: [] }
    expect(canonicalSolution("PETRI_FIRE_SEQUENCE", payload, { finalMarking: { p1: 1, p2: 0 } })).toBe("p1 = 1, p2 = 0")
  })

  it("shows code as written, not reformatted", () => {
    expect(canonicalSolution("CODE_WRITE", { spec: "", tests: [] }, { referenceCode: "a\nb" })).toBe("a\nb")
    expect(describeSubmission("CODE_FIX", { spec: "", tests: [] }, { code: "c", checked: [] })).toBe("c")
  })

  it("joins the rows of a trace table", () => {
    const payload = { script: "", format: "table" } as never
    expect(canonicalSolution("TRACE_EXECUTION", payload, { expectedOutput: [["a", "b"]] })).toBe("a | b")
  })

  it("lists the answers a reminder must not quote", () => {
    const options = [{ id: "a", label: "Bon" }, { id: "b", label: "Faux" }]
    expect(answerTexts("MCQ_SINGLE", { options }, { correct: ["a"] })).toEqual(["Bon"])
    expect(answerTexts("TRUE_FALSE", {} as never, { value: true })).toEqual([])
  })
})
