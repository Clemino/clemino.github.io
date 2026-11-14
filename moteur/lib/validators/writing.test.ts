import { describe, expect, it } from "vitest"
import { validateWriting } from "./writing"

const payload = {
  modelAnswer: "Corrigé",
  rubric: [
    { id: "a", label: "Problématique" },
    { id: "b", label: "Plan" },
    { id: "c", label: "Jurisprudence" },
    { id: "d", label: "Conclusion" },
  ],
}

describe("validateWriting", () => {
  it("scores the share of criteria the student ticked", () => {
    const r = validateWriting(
      payload,
      { text: "copie", checked: ["a", "b"] },
      ""
    )
    expect(r.score).toBe(0.5)
    expect(r.feedback.map((f) => f.ok)).toEqual([true, true, false, false])
  })

  it("passes from 70 % of the criteria", () => {
    expect(
      validateWriting(payload, { text: "", checked: ["a", "b", "c"] }, "")
        .passed
    ).toBe(true)
    expect(
      validateWriting(payload, { text: "", checked: ["a", "b"] }, "").passed
    ).toBe(false)
  })

  it("ignores ticks that are not in the rubric", () => {
    expect(
      validateWriting(payload, { text: "", checked: ["x"] }, "").score
    ).toBe(0)
  })
})
