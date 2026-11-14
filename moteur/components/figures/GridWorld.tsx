"use client"

import type { GridCell } from "./types"
import { FigureFrame } from "./FigureFrame"

const ARROW: Record<NonNullable<GridCell["policy"]>, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
}

/**
 * A reinforcement-learning grid world for RL exercises. Cells can be walls
 * (filled), terminal/goal cells (accent), the start cell, and may show a
 * reward value and/or a policy arrow.
 */
export function GridWorld({
  rows,
  cols,
  cells,
  caption,
}: {
  rows: number
  cols: number
  cells: GridCell[]
  caption?: string
}) {
  const byPos = new Map(cells.map((c) => [`${c.row}-${c.col}`, c]))

  return (
    <FigureFrame label="Monde en grille" caption={caption}>
      <div
        className="grid w-fit gap-[2px] rounded-[3px] bg-[var(--border)] p-[2px]"
        style={{ gridTemplateColumns: `repeat(${cols}, 56px)` }}
        role="grid"
        aria-label="Monde en grille"
      >
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const cell = byPos.get(`${r}-${c}`)
            const wall = cell?.wall
            const terminal = cell?.terminal
            const start = cell?.start

            const bg = wall
              ? "var(--bg-3)"
              : terminal
                ? "var(--accent-dim)"
                : "var(--bg-1)"
            const borderColor = terminal
              ? "var(--accent)"
              : start
                ? "var(--info)"
                : "var(--border)"

            return (
              <div
                key={`${r}-${c}`}
                role="gridcell"
                className="relative flex h-14 flex-col items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: bg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 2,
                }}
              >
                {wall ? (
                  <span
                    className="font-mono text-[10px] tracking-wide text-[var(--fg-3)] uppercase"
                    aria-label="mur"
                  >
                    mur
                  </span>
                ) : (
                  <>
                    {cell?.policy && (
                      <span
                        className="text-[18px] leading-none text-[var(--accent)]"
                        aria-label={`politique ${cell.policy}`}
                      >
                        {ARROW[cell.policy]}
                      </span>
                    )}
                    {cell?.reward !== undefined && (
                      <span
                        className="font-mono text-[12px] font-semibold tabular-nums"
                        style={{
                          color:
                            cell.reward > 0
                              ? "var(--success)"
                              : cell.reward < 0
                                ? "var(--error)"
                                : "var(--fg-1)",
                        }}
                      >
                        {cell.reward > 0 ? `+${cell.reward}` : cell.reward}
                      </span>
                    )}
                    {cell?.label && (
                      <span className="font-mono text-[10px] text-[var(--fg-2)]">
                        {cell.label}
                      </span>
                    )}
                  </>
                )}

                {start && (
                  <span
                    className="absolute top-[2px] left-[3px] font-mono text-[8px] tracking-wide text-[var(--info)] uppercase"
                    aria-label="départ"
                  >
                    départ
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>
    </FigureFrame>
  )
}
