import { describe, expect, it } from "vitest"
import { validatePredictOutput } from "./predictOutput"

describe("validatePredictOutput", () => {
  it("réussit quand la sortie correspond (aux espaces près)", () => {
    const r = validatePredictOutput({ program: "" }, { expectedOutput: "42\n" }, { output: "42" }, "")
    expect(r.passed).toBe(true)
  })
  it("échoue quand la sortie diffère", () => {
    const r = validatePredictOutput({ program: "" }, { expectedOutput: "42" }, { output: "24" }, "")
    expect(r.passed).toBe(false)
  })
})
