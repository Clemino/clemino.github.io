import { describe, expect, it } from "vitest"
import { shuffled } from "./shuffle"

describe("shuffled", () => {
  it("keeps every item and leaves the original untouched", () => {
    const items = [1, 2, 3, 4]
    expect([...shuffled(items)].sort()).toEqual(items)
    expect(items).toEqual([1, 2, 3, 4])
  })

  it("does not always return the same order", () => {
    const items = Array.from({ length: 20 }, (_, i) => i)
    expect(shuffled(items)).not.toEqual(shuffled(items))
  })
})
