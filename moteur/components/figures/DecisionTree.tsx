"use client"

import type { DecisionTreeNode } from "./types"
import { FigureFrame } from "./FigureFrame"

const NODE_W = 96 // box width
const NODE_H = 34 // box height
const H_GAP = 28 // gap between sibling subtrees
const V_GAP = 84 // vertical distance between tiers
const PAD = 24

/** Maximum characters that fit inside a node box at the current font size (~7 px/char, monospace). */
const NODE_LABEL_MAX = 12
/** Maximum characters that fit on an edge label (smaller font, shorter area). */
const EDGE_LABEL_MAX = 16

/**
 * Truncates `text` to `maxLen` characters, appending `…` when trimmed.
 * A full-text `<title>` element should be included alongside the `<text>` for
 * accessibility and hover tooltips when truncation occurs.
 */
function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text
}

type Placed = {
  node: DecisionTreeNode
  x: number
  depth: number
  edgeLabel?: string
  children: Placed[]
}

/** Bottom-up x assignment: leaves spread evenly, parents centred over kids. */
function layout(
  node: DecisionTreeNode,
  depth: number,
  edgeLabel: string | undefined,
  cursor: { x: number },
): Placed {
  const branches = node.branches ?? []
  if (branches.length === 0) {
    const x = cursor.x
    cursor.x += NODE_W + H_GAP
    return { node, x, depth, edgeLabel, children: [] }
  }
  const children = branches.map((b) => layout(b.child, depth + 1, b.edgeLabel, cursor))
  const x = (children[0].x + children[children.length - 1].x) / 2
  return { node, x, depth, edgeLabel, children }
}

function flatten(p: Placed, acc: Placed[]): Placed[] {
  acc.push(p)
  p.children.forEach((c) => flatten(c, acc))
  return acc
}

/** A decision tree for classification / decision-tree exercises. */
export function DecisionTree({
  root,
  caption,
}: {
  root: DecisionTreeNode
  caption?: string
}) {
  const placed = layout(root, 0, undefined, { x: PAD })
  const all = flatten(placed, [])
  const maxDepth = all.reduce((m, p) => Math.max(m, p.depth), 0)

  const width = all.reduce((m, p) => Math.max(m, p.x), 0) + NODE_W + PAD
  const height = maxDepth * V_GAP + NODE_H + 2 * PAD

  const cxOf = (p: Placed) => p.x + NODE_W / 2
  const cyOf = (depth: number) => PAD + depth * V_GAP + NODE_H / 2

  return (
    <FigureFrame label="Arbre de décision" caption={caption}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        role="img"
        aria-label="Arbre de décision"
      >
        {all.flatMap((p) =>
          p.children.map((c, i) => {
            const x1 = cxOf(p)
            const y1 = cyOf(p.depth) + NODE_H / 2
            const x2 = cxOf(c)
            const y2 = cyOf(c.depth) - NODE_H / 2
            return (
              <g key={`edge-${p.depth}-${p.x}-${i}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--border-strong)"
                  strokeWidth={1.5}
                />
                {c.edgeLabel && (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={10}
                    fontFamily="var(--font-mono)"
                    fill="var(--accent)"
                  >
                    {c.edgeLabel.length > EDGE_LABEL_MAX && (
                      <title>{c.edgeLabel}</title>
                    )}
                    <tspan
                      style={{ paintOrder: "stroke" }}
                      stroke="var(--bg-1)"
                      strokeWidth={4}
                    >
                      {truncate(c.edgeLabel, EDGE_LABEL_MAX)}
                    </tspan>
                  </text>
                )}
              </g>
            )
          }),
        )}

        {all.map((p, i) => {
          const isLeaf = p.node.type === "leaf"
          const x = p.x
          const y = cyOf(p.depth) - NODE_H / 2
          return (
            <g key={`node-${i}`}>
              <rect
                x={x}
                y={y}
                width={NODE_W}
                height={NODE_H}
                rx={isLeaf ? 16 : 5}
                fill={isLeaf ? "var(--bg-3)" : "var(--bg-2)"}
                stroke={isLeaf ? "var(--accent)" : "var(--border-strong)"}
                strokeWidth={1.5}
              />
              <text
                x={x + NODE_W / 2}
                y={y + NODE_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11.5}
                fontFamily="var(--font-mono)"
                fontWeight={600}
                fill={isLeaf ? "var(--accent)" : "var(--fg-0)"}
              >
                {p.node.label.length > NODE_LABEL_MAX && (
                  <title>{p.node.label}</title>
                )}
                {truncate(p.node.label, NODE_LABEL_MAX)}
              </text>
            </g>
          )
        })}
      </svg>
    </FigureFrame>
  )
}
