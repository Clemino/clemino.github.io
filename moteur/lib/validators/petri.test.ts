import { describe, expect, it } from "vitest"
import {
  validatePetriEnabledTransitions,
  validatePetriFireSequence,
  validatePetriInvariant,
  validatePetriMatrix,
} from "./petri"

const payload = {
  places: [
    { id: "p1", tokens: 1 },
    { id: "p2", tokens: 0 },
  ],
  transitions: [{ id: "t1" }, { id: "t2" }],
  arcs: [
    { from: "p1", to: "t1" },
    { from: "t1", to: "p2" },
    { from: "p2", to: "t2" },
    { from: "t2", to: "p1" },
  ],
}

describe("validateurs Petri", () => {
  it("valide les transitions franchissables", () => {
    const result = validatePetriEnabledTransitions(
      payload,
      { enabledTransitionIds: ["t1"] },
      { selectedTransitionIds: ["t1"] },
      "ok",
    )
    expect(result.passed).toBe(true)
  })

  it("note partiellement un marquage final", () => {
    const result = validatePetriFireSequence(
      { ...payload, sequence: ["t1"] },
      { finalMarking: { p1: 0, p2: 1 } },
      { marking: { p1: 0, p2: 0 } },
      "ok",
    )
    expect(result.passed).toBe(false)
    expect(result.score).toBe(0.5)
  })

  it("valide une matrice d'incidence", () => {
    const result = validatePetriMatrix(
      { ...payload, matrix: "incidence" },
      { matrix: { p1: { t1: -1, t2: 1 }, p2: { t1: 1, t2: -1 } } },
      { matrix: { p1: { t1: -1, t2: 1 }, p2: { t1: 1, t2: -1 } } },
      "ok",
    )
    expect(result.passed).toBe(true)
  })

  it("valide un invariant de places", () => {
    const result = validatePetriInvariant(
      {
        ...payload,
        invariantType: "place",
        vectors: [
          { id: "a", label: "p1+p2", values: { p1: 1, p2: 1 } },
          { id: "b", label: "p1 seul", values: { p1: 1, p2: 0 } },
        ],
      },
      { correct: ["a"] },
      { selected: ["a"] },
      "ok",
    )
    expect(result.passed).toBe(true)
  })
})
