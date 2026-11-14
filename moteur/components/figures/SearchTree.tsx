"use client"

import type { SearchEdge, SearchNode } from "./types"
import { FigureFrame } from "./FigureFrame"

const R = 22 // node radius
const V_GAP = 96 // vertical distance between BFS tiers
const H_GAP = 36 // horizontal gap between siblings
const PAD = 28

type Placed = { node: SearchNode; x: number; y: number }

/**
 * Lays the graph out as a tree rooted at `startId` (BFS levels). Nodes not
 * reachable from the start are appended on a final row. Works for the tree
 * and DAG search graphs used in A* / BFS / DFS exercises.
 *
 * Known limitation (DAGs): each node is positioned on its *first* BFS visit.
 * If a node is reachable from multiple parents, only the first parent
 * determines its x coordinate; edges from later parents may appear slightly
 * skewed. This is acceptable for the small trees/DAGs used in course exercises
 * and avoids the complexity of a full DAG layout algorithm.
 */
function layout(
  nodes: SearchNode[],
  edges: SearchEdge[],
  startId?: string
): Map<string, Placed> {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const childrenOf = new Map<string, string[]>()
  for (const e of edges) {
    if (!childrenOf.has(e.from)) childrenOf.set(e.from, [])
    childrenOf.get(e.from)!.push(e.to)
  }

  const placed = new Map<string, Placed>()
  const seen = new Set<string>()
  const cursor = { x: PAD + R }

  const root = startId && byId.has(startId) ? startId : nodes[0]?.id
  let maxDepth = 0

  const assign = (id: string, depth: number): number => {
    if (seen.has(id)) return placed.get(id)?.x ?? cursor.x
    seen.add(id)
    maxDepth = Math.max(maxDepth, depth)
    const node = byId.get(id)!
    const kids = (childrenOf.get(id) ?? []).filter(
      (k) => !seen.has(k) && byId.has(k)
    )
    let x: number
    if (kids.length === 0) {
      x = cursor.x
      cursor.x += 2 * R + H_GAP
    } else {
      const xs = kids.map((k) => assign(k, depth + 1))
      x = (xs[0] + xs[xs.length - 1]) / 2
    }
    placed.set(id, { node, x, y: PAD + R + depth * V_GAP })
    return x
  }

  if (root) assign(root, 0)

  // place anything unreachable from the root on the row below
  for (const n of nodes) {
    if (!placed.has(n.id)) {
      placed.set(n.id, {
        node: n,
        x: cursor.x,
        y: PAD + R + (maxDepth + 1) * V_GAP,
      })
      cursor.x += 2 * R + H_GAP
    }
  }
  return placed
}

/** A state-space search graph for A* / BFS / DFS exercises. */
export function SearchTree({
  nodes,
  edges,
  startId,
  goalIds = [],
  caption,
}: {
  nodes: SearchNode[]
  edges: SearchEdge[]
  startId?: string
  goalIds?: string[]
  caption?: string
}) {
  const placed = layout(nodes, edges, startId)
  const goals = new Set(goalIds)

  const xs = [...placed.values()].map((p) => p.x)
  const ys = [...placed.values()].map((p) => p.y)
  const width = (xs.length ? Math.max(...xs) : PAD) + R + PAD
  const height = (ys.length ? Math.max(...ys) : PAD) + R + PAD + 14

  return (
    <FigureFrame label="Arbre de recherche" caption={caption}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        role="img"
        aria-label="Arbre de recherche"
      >
        <defs>
          <marker
            id="search-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--border-strong)" />
          </marker>
        </defs>

        {edges.map((e, i) => {
          const a = placed.get(e.from)
          const b = placed.get(e.to)
          if (!a || !b) return null
          const dx = b.x - a.x
          const dy = b.y - a.y
          const len = Math.hypot(dx, dy) || 1
          const ux = dx / len
          const uy = dy / len
          const x1 = a.x + ux * R
          const y1 = a.y + uy * R
          const x2 = b.x - ux * (R + 4)
          const y2 = b.y - uy * (R + 4)
          return (
            <g key={`edge-${i}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--border-strong)"
                strokeWidth={1.5}
                markerEnd="url(#search-arrow)"
              />
              {e.cost !== undefined && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fill="var(--fg-2)"
                >
                  <tspan
                    dx={0}
                    style={{ paintOrder: "stroke" }}
                    stroke="var(--bg-1)"
                    strokeWidth={3}
                  >
                    {e.cost}
                  </tspan>
                </text>
              )}
            </g>
          )
        })}

        {[...placed.values()].map((p, i) => {
          const isStart = p.node.id === startId
          const isGoal = goals.has(p.node.id)
          const stroke = isGoal
            ? "var(--success)"
            : isStart
              ? "var(--accent)"
              : "var(--border-strong)"
          const fill = isGoal
            ? "var(--bg-3)"
            : isStart
              ? "var(--accent-dim)"
              : "var(--bg-2)"
          const f =
            p.node.g !== undefined && p.node.h !== undefined
              ? p.node.g + p.node.h
              : undefined
          return (
            <g key={`node-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={R}
                fill={fill}
                stroke={stroke}
                strokeWidth={isStart || isGoal ? 2 : 1.5}
              />
              <text
                x={p.x}
                y={p.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fontFamily="var(--font-mono)"
                fontWeight={600}
                fill="var(--fg-0)"
              >
                {p.node.label}
              </text>
              {(p.node.g !== undefined || p.node.h !== undefined) && (
                <text
                  x={p.x}
                  y={p.y + R + 12}
                  textAnchor="middle"
                  fontSize={9.5}
                  fontFamily="var(--font-mono)"
                  fill="var(--fg-2)"
                >
                  {[
                    p.node.g !== undefined ? `g=${p.node.g}` : null,
                    p.node.h !== undefined ? `h=${p.node.h}` : null,
                    f !== undefined ? `f=${f}` : null,
                  ]
                    .filter(Boolean)
                    .join("  ")}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </FigureFrame>
  )
}
