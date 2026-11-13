import { describe, expect, it } from "vitest"
import {
  enabledTransitions,
  fireSequence,
  incidenceMatrix,
  isPInvariant,
  isTInvariant,
  reachableGraph,
} from "./core"
import type { PetriNet } from "./types"

const net: PetriNet = {
  places: [
    { id: "p1", tokens: 1 },
    { id: "p2", tokens: 0 },
    { id: "p3", tokens: 2 },
  ],
  transitions: [{ id: "t1" }, { id: "t2" }],
  arcs: [
    { from: "p1", to: "t1" },
    { from: "t1", to: "p2" },
    { from: "p3", to: "t2", weight: 2 },
    { from: "t2", to: "p1" },
  ],
}

describe("Petri core", () => {
  it("calcule les transitions franchissables avec les poids", () => {
    expect(enabledTransitions(net, { p1: 1, p2: 0, p3: 2 })).toEqual(["t1", "t2"])
    expect(enabledTransitions(net, { p1: 0, p2: 0, p3: 1 })).toEqual([])
  })

  it("applique une sequence de tirs et conserve le marquage atteint", () => {
    const result = fireSequence(net, { p1: 1, p2: 0, p3: 2 }, ["t1", "t2"])
    expect(result.valid).toBe(true)
    expect(result.marking).toEqual({ p1: 1, p2: 1, p3: 0 })
  })

  it("calcule la matrice d'incidence Post - Pre", () => {
    expect(incidenceMatrix(net)).toEqual({
      p1: { t1: -1, t2: 1 },
      p2: { t1: 1, t2: 0 },
      p3: { t1: 0, t2: -2 },
    })
  })

  it("verifie des invariants simples", () => {
    const cycle: PetriNet = {
      places: [{ id: "idle", tokens: 1 }, { id: "busy", tokens: 0 }],
      transitions: [{ id: "start" }, { id: "finish" }],
      arcs: [
        { from: "idle", to: "start" },
        { from: "start", to: "busy" },
        { from: "busy", to: "finish" },
        { from: "finish", to: "idle" },
      ],
    }
    expect(isPInvariant(cycle, { idle: 1, busy: 1 })).toBe(true)
    expect(isTInvariant(cycle, { start: 1, finish: 1 })).toBe(true)
  })

  it("construit un graphe d'accessibilite borne", () => {
    const graph = reachableGraph(net, { p1: 1, p2: 0, p3: 2 }, 10)
    expect(graph.truncated).toBe(false)
    expect(graph.nodes.length).toBeGreaterThan(1)
    expect(graph.edges.some((e) => e.transitionId === "t1")).toBe(true)
  })
})
