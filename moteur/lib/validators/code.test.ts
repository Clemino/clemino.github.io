import { describe, expect, it } from "vitest"
import { CODE_CHECKS, validateCode } from "./code"

const solution = { referenceCode: "int main() {}" }

describe("validateCode", () => {
  it("passes only when the student ticks every check", () => {
    const all = CODE_CHECKS.map((c) => c.id)
    expect(validateCode(solution, { code: "x", checked: all }, "").passed).toBe(true)
    expect(validateCode(solution, { code: "x", checked: all.slice(1) }, "").passed).toBe(false)
  })

  it("reveals the reference code", () => {
    expect(validateCode(solution, { code: "", checked: [] }, "").reveal.canonicalSolution).toBe("int main() {}")
  })
})
