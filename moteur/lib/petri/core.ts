import type { Marking, PetriMatrix, PetriNet, ReachabilityGraph } from "./types"

export function placeIds(net: PetriNet): string[] {
  return net.places.map((p) => p.id)
}

export function transitionIds(net: PetriNet): string[] {
  return net.transitions.map((t) => t.id)
}

export function initialMarking(net: PetriNet, explicit?: Marking): Marking {
  const marking: Marking = {}
  for (const place of net.places) {
    marking[place.id] = explicit?.[place.id] ?? place.tokens ?? 0
  }
  return marking
}

export function preMatrix(net: PetriNet): PetriMatrix {
  return buildMatrix(net, "pre")
}

export function postMatrix(net: PetriNet): PetriMatrix {
  return buildMatrix(net, "post")
}

export function incidenceMatrix(net: PetriNet): PetriMatrix {
  const pre = preMatrix(net)
  const post = postMatrix(net)
  const matrix = zeroMatrix(net)
  for (const p of placeIds(net)) {
    for (const t of transitionIds(net)) {
      matrix[p][t] = post[p][t] - pre[p][t]
    }
  }
  return matrix
}

export function isEnabled(net: PetriNet, marking: Marking, transitionId: string): boolean {
  const pre = preMatrix(net)
  if (!transitionIds(net).includes(transitionId)) return false
  return placeIds(net).every((placeId) => (marking[placeId] ?? 0) >= (pre[placeId]?.[transitionId] ?? 0))
}

export function enabledTransitions(net: PetriNet, marking: Marking): string[] {
  return transitionIds(net).filter((transitionId) => isEnabled(net, marking, transitionId))
}

export function fireTransition(net: PetriNet, marking: Marking, transitionId: string): Marking | null {
  if (!isEnabled(net, marking, transitionId)) return null
  const incidence = incidenceMatrix(net)
  const next: Marking = {}
  for (const placeId of placeIds(net)) {
    next[placeId] = (marking[placeId] ?? 0) + (incidence[placeId]?.[transitionId] ?? 0)
  }
  return next
}

export function fireSequence(
  net: PetriNet,
  marking: Marking,
  sequence: string[],
): { valid: boolean; marking: Marking; failedAt?: number } {
  let current = { ...marking }
  for (let i = 0; i < sequence.length; i += 1) {
    const next = fireTransition(net, current, sequence[i])
    if (!next) return { valid: false, marking: current, failedAt: i }
    current = next
  }
  return { valid: true, marking: current }
}

export function matrixEquals(a: PetriMatrix, b: PetriMatrix): boolean {
  const rows = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const row of rows) {
    const cols = new Set([...Object.keys(a[row] ?? {}), ...Object.keys(b[row] ?? {})])
    for (const col of cols) {
      if ((a[row]?.[col] ?? 0) !== (b[row]?.[col] ?? 0)) return false
    }
  }
  return true
}

export function markingEquals(a: Marking, b: Marking, places: string[] = Object.keys({ ...a, ...b })): boolean {
  return places.every((placeId) => Number(a[placeId] ?? 0) === Number(b[placeId] ?? 0))
}

export function markingKey(marking: Marking, places: string[]): string {
  return places.map((placeId) => `${placeId}:${marking[placeId] ?? 0}`).join("|")
}

export function markingLabel(marking: Marking, places: string[]): string {
  return `(${places.map((placeId) => marking[placeId] ?? 0).join(", ")})`
}

export function isPInvariant(net: PetriNet, vector: Record<string, number>): boolean {
  const incidence = incidenceMatrix(net)
  for (const transitionId of transitionIds(net)) {
    const sum = placeIds(net).reduce(
      (acc, placeId) => acc + (vector[placeId] ?? 0) * (incidence[placeId]?.[transitionId] ?? 0),
      0,
    )
    if (sum !== 0) return false
  }
  return true
}

export function isTInvariant(net: PetriNet, vector: Record<string, number>): boolean {
  const incidence = incidenceMatrix(net)
  for (const placeId of placeIds(net)) {
    const sum = transitionIds(net).reduce(
      (acc, transitionId) => acc + (incidence[placeId]?.[transitionId] ?? 0) * (vector[transitionId] ?? 0),
      0,
    )
    if (sum !== 0) return false
  }
  return true
}

export function reachableGraph(net: PetriNet, start: Marking, limit = 80): ReachabilityGraph {
  const places = placeIds(net)
  const nodes: ReachabilityGraph["nodes"] = []
  const edges: ReachabilityGraph["edges"] = []
  const seen = new Map<string, string>()
  const queue: Marking[] = [start]

  const startKey = markingKey(start, places)
  seen.set(startKey, "m0")
  nodes.push({ id: "m0", marking: start })

  while (queue.length > 0 && nodes.length <= limit) {
    const current = queue.shift() as Marking
    const from = seen.get(markingKey(current, places)) as string
    for (const transitionId of enabledTransitions(net, current)) {
      const next = fireTransition(net, current, transitionId) as Marking
      const key = markingKey(next, places)
      let to = seen.get(key)
      if (!to) {
        to = `m${nodes.length}`
        seen.set(key, to)
        nodes.push({ id: to, marking: next })
        queue.push(next)
      }
      edges.push({ from, to, transitionId })
      if (nodes.length > limit) return { nodes, edges, truncated: true }
    }
  }

  return { nodes, edges, truncated: false }
}

function zeroMatrix(net: PetriNet): PetriMatrix {
  const matrix: PetriMatrix = {}
  for (const p of placeIds(net)) {
    matrix[p] = {}
    for (const t of transitionIds(net)) matrix[p][t] = 0
  }
  return matrix
}

function buildMatrix(net: PetriNet, kind: "pre" | "post"): PetriMatrix {
  const matrix = zeroMatrix(net)
  const places = new Set(placeIds(net))
  const transitions = new Set(transitionIds(net))
  for (const arc of net.arcs) {
    const weight = arc.weight ?? 1
    if (kind === "pre" && places.has(arc.from) && transitions.has(arc.to)) {
      matrix[arc.from][arc.to] += weight
    }
    if (kind === "post" && transitions.has(arc.from) && places.has(arc.to)) {
      matrix[arc.to][arc.from] += weight
    }
  }
  return matrix
}
