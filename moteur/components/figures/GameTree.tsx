"use client"

import type { GameTreeNode } from "./types"
import { FigureFrame } from "./FigureFrame"

/* Layout constants (SVG user units). */
const NODE = 30 // node diameter / square side
const H_GAP = 26 // minimum horizontal gap between sibling subtrees
const V_GAP = 78 // vertical distance between tiers
const PAD = 24 // outer padding inside the SVG

type Placed = {
  node: GameTreeNode
  x: number
  depth: number
  children: Placed[]
}

/** Assigns x positions bottom-up: leaves are spread evenly, parents centred. */
function layout(node: GameTreeNode, depth: number, cursor: { x: number }): Placed {
  const kids = node.children ?? []
  if (kids.length === 0) {
    const x = cursor.x
    cursor.x += NODE + H_GAP
    return { node, x, depth, children: [] }
  }
  const children = kids.map((c) => layout(c, depth + 1, cursor))
  const x = (children[0].x + children[children.length - 1].x) / 2
  return { node, x, depth, children }
}

function flatten(p: Placed, acc: Placed[]): Placed[] {
  acc.push(p)
  p.children.forEach((c) => flatten(c, acc))
  return acc
}

/** A figure of a two-player game tree for minimax / alpha-beta exercises. */
export function GameTree({ root, caption }: { root: GameTreeNode; caption?: string }) {
  const placed = layout(root, 0, { x: PAD + NODE / 2 })
  const all = flatten(placed, [])
  const maxDepth = all.reduce((m, p) => Math.max(m, p.depth), 0)

  const width = all.reduce((m, p) => Math.max(m, p.x), 0) + NODE / 2 + PAD
  const height = maxDepth * V_GAP + NODE + 2 * PAD

  const yOf = (depth: number) => PAD + NODE / 2 + depth * V_GAP

  return (
    <FigureFrame label="Arbre de jeu" caption={caption}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        role="img"
        aria-label="Arbre de jeu"
      >
        {/* edges first so nodes draw on top */}
        {all.flatMap((p) =>
          p.children.map((c) => (
            <line
              key={`${p.x}-${p.depth}-${c.x}-${c.depth}`}
              x1={p.x}
              y1={yOf(p.depth) + NODE / 2}
              x2={c.x}
              y2={yOf(c.depth) - NODE / 2}
              stroke="var(--border-strong)"
              strokeWidth={1.5}
            />
          )),
        )}

        {all.map((p, i) => {
          const cx = p.x
          const cy = yOf(p.depth)
          // Leaf nodes always display their numeric value.
          // Internal max/min nodes display their value when present; when absent
          // the triangle is left empty (no placeholder — "?" was dead code because
          // the render path already fell through to "" for internal nodes).
          const hasValue = p.node.value !== undefined

          return (
            <g key={`node-${i}`}>
              {p.node.type === "leaf" ? (
                <rect
                  x={cx - NODE / 2}
                  y={cy - NODE / 2}
                  width={NODE}
                  height={NODE}
                  rx={3}
                  fill="var(--bg-3)"
                  stroke="var(--accent)"
                  strokeWidth={1.5}
                />
              ) : (
                <polygon
                  points={trianglePoints(cx, cy, p.node.type === "max")}
                  fill="var(--bg-2)"
                  stroke="var(--border-strong)"
                  strokeWidth={1.5}
                />
              )}
              <text
                x={cx}
                y={cy + (p.node.type === "min" ? -3 : p.node.type === "max" ? 5 : 1)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fontFamily="var(--font-mono)"
                fontWeight={600}
                fill="var(--fg-0)"
              >
                {p.node.type === "leaf"
                  ? String(p.node.value)
                  : hasValue
                    ? String(p.node.value)
                    : /* empty slot — triangle shown without a value label */ ""}
              </text>
              {p.node.label && (
                <text
                  x={cx}
                  y={cy - NODE / 2 - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fill="var(--fg-2)"
                >
                  {p.node.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </FigureFrame>
  )
}

/** Equilateral-ish triangle: pointing up for MAX, down for MIN. */
function trianglePoints(cx: number, cy: number, up: boolean): string {
  const r = NODE / 2
  return up
    ? `${cx},${cy - r} ${cx - r},${cy + r} ${cx + r},${cy + r}`
    : `${cx},${cy + r} ${cx - r},${cy - r} ${cx + r},${cy - r}`
}
