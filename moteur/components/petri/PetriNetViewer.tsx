"use client"

import type {
  PetriArc,
  PetriPlace,
  PetriTransition,
} from "@/lib/validators/types"
import { cn } from "@/lib/utils"

export type PetriNetViewerProps = {
  places: PetriPlace[]
  transitions: PetriTransition[]
  arcs: PetriArc[]
  marking?: Record<string, number>
  selectedTransitionIds?: string[]
  enabledTransitionIds?: string[]
  className?: string
}

type NodePos = {
  id: string
  label: string
  x: number
  y: number
  kind: "place" | "transition"
  tokens?: number
}

export function PetriNetViewer({
  places,
  transitions,
  arcs,
  marking,
  selectedTransitionIds = [],
  enabledTransitionIds = [],
  className,
}: PetriNetViewerProps) {
  const nodes = layoutNodes(places, transitions, marking)
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const selected = new Set(selectedTransitionIds)
  const enabled = new Set(enabledTransitionIds)

  return (
    <div
      className={cn(
        "rounded-md border border-[var(--border)] bg-[var(--bg-0)] p-3",
        className
      )}
    >
      <svg
        viewBox="0 0 720 360"
        role="img"
        aria-label="Reseau de Petri"
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="petri-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill="var(--fg-2)" />
          </marker>
        </defs>
        {arcs.map((arc, index) => {
          const from = byId.get(arc.from)
          const to = byId.get(arc.to)
          if (!from || !to) return null
          const dx = to.x - from.x
          const dy = to.y - from.y
          const length = Math.hypot(dx, dy) || 1
          const fromPad = from.kind === "place" ? 28 : 24
          const toPad = to.kind === "place" ? 30 : 26
          const x1 = from.x + (dx / length) * fromPad
          const y1 = from.y + (dy / length) * fromPad
          const x2 = to.x - (dx / length) * toPad
          const y2 = to.y - (dy / length) * toPad
          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2
          return (
            <g key={`${arc.from}-${arc.to}-${index}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--fg-2)"
                strokeWidth="2"
                markerEnd="url(#petri-arrow)"
              />
              {(arc.weight ?? 1) > 1 && (
                <text
                  x={midX + 6}
                  y={midY - 6}
                  className="fill-[var(--fg-1)] font-mono text-[14px]"
                >
                  {arc.weight}
                </text>
              )}
            </g>
          )
        })}

        {nodes.map((node) =>
          node.kind === "place" ? (
            <PlaceNode key={node.id} node={node} />
          ) : (
            <TransitionNode
              key={node.id}
              node={node}
              selected={selected.has(node.id)}
              enabled={enabled.has(node.id)}
            />
          )
        )}
      </svg>
    </div>
  )
}

function PlaceNode({ node }: { node: NodePos }) {
  const tokens = node.tokens ?? 0
  return (
    <g>
      <circle
        cx={node.x}
        cy={node.y}
        r="28"
        fill="var(--bg-1)"
        stroke="var(--border-strong)"
        strokeWidth="2"
      />
      {tokens <= 5 ? (
        tokenPositions(tokens).map(([dx, dy], i) => (
          <circle
            key={i}
            cx={node.x + dx}
            cy={node.y + dy}
            r="4"
            fill="var(--accent)"
          />
        ))
      ) : (
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          className="fill-[var(--accent)] font-mono text-[15px]"
        >
          {tokens}
        </text>
      )}
      <text
        x={node.x}
        y={node.y + 48}
        textAnchor="middle"
        className="fill-[var(--fg-1)] font-mono text-[13px]"
      >
        {node.label}
      </text>
    </g>
  )
}

function TransitionNode({
  node,
  selected,
  enabled,
}: {
  node: NodePos
  selected: boolean
  enabled: boolean
}) {
  return (
    <g>
      <rect
        x={node.x - 12}
        y={node.y - 30}
        width="24"
        height="60"
        rx="3"
        fill={
          selected
            ? "var(--accent)"
            : enabled
              ? "var(--accent-dim)"
              : "var(--bg-2)"
        }
        stroke={selected || enabled ? "var(--accent)" : "var(--border-strong)"}
        strokeWidth="2"
      />
      <text
        x={node.x}
        y={node.y + 50}
        textAnchor="middle"
        className="fill-[var(--fg-1)] font-mono text-[13px]"
      >
        {node.label}
      </text>
    </g>
  )
}

function layoutNodes(
  places: PetriPlace[],
  transitions: PetriTransition[],
  marking?: Record<string, number>
): NodePos[] {
  const nodes: NodePos[] = []
  const placeFallback = distribute(places.length, 120, 280)
  const transitionFallback = distribute(transitions.length, 120, 280)
  places.forEach((place, index) => {
    nodes.push({
      id: place.id,
      label: place.label ?? place.id,
      x: place.x ?? 120 + (index % 3) * 240,
      y: place.y ?? placeFallback[index],
      kind: "place",
      tokens: marking?.[place.id] ?? place.tokens ?? 0,
    })
  })
  transitions.forEach((transition, index) => {
    nodes.push({
      id: transition.id,
      label: transition.label ?? transition.id,
      x: transition.x ?? 240 + (index % 2) * 240,
      y: transition.y ?? transitionFallback[index],
      kind: "transition",
    })
  })
  return nodes
}

function distribute(count: number, min: number, max: number): number[] {
  if (count <= 1) return [(min + max) / 2]
  const step = (max - min) / (count - 1)
  return Array.from({ length: count }, (_, i) => min + i * step)
}

function tokenPositions(count: number): Array<[number, number]> {
  if (count <= 0) return []
  if (count === 1) return [[0, 0]]
  if (count === 2)
    return [
      [-7, 0],
      [7, 0],
    ]
  if (count === 3)
    return [
      [0, -8],
      [-8, 7],
      [8, 7],
    ]
  if (count === 4)
    return [
      [-8, -8],
      [8, -8],
      [-8, 8],
      [8, 8],
    ]
  return [
    [0, 0],
    [-10, -9],
    [10, -9],
    [-10, 9],
    [10, 9],
  ]
}
