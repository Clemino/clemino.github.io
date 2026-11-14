export type PetriPlace = {
  id: string
  label?: string
  tokens?: number
  x?: number
  y?: number
}
export type PetriTransition = {
  id: string
  label?: string
  x?: number
  y?: number
}
export type PetriArc = { from: string; to: string; weight?: number }

export type PetriNet = {
  places: PetriPlace[]
  transitions: PetriTransition[]
  arcs: PetriArc[]
}

export type Marking = Record<string, number>
export type PetriMatrix = Record<string, Record<string, number>>

export type ReachabilityNode = { id: string; marking: Marking }
export type ReachabilityEdge = {
  from: string
  to: string
  transitionId: string
}
export type ReachabilityGraph = {
  nodes: ReachabilityNode[]
  edges: ReachabilityEdge[]
  truncated: boolean
}
