"use client"

import { FigureFrame } from "./FigureFrame"

/**
 * A dataset table for data-mining / Bayes exercises. Reuses the platform's
 * MDX table treatment (mono-caps headers, hairline borders) and supports
 * highlighting whole rows or columns by index.
 */
export function DataTable({
  columns,
  rows,
  highlightRows = [],
  highlightCols = [],
  caption,
}: {
  columns: string[]
  rows: (string | number)[][]
  highlightRows?: number[]
  highlightCols?: number[]
  caption?: string
}) {
  const hiRows = new Set(highlightRows)
  const hiCols = new Set(highlightCols)

  return (
    <FigureFrame label="Jeu de données" caption={caption}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((col, c) => (
              <th
                key={c}
                className="border-b border-[var(--border)] px-3 py-2 text-left font-mono text-xs font-medium tracking-wide text-[var(--fg-1)] uppercase"
                style={
                  hiCols.has(c)
                    ? {
                        backgroundColor: "var(--accent-dim)",
                        color: "var(--fg-0)",
                      }
                    : { backgroundColor: "var(--bg-2)" }
                }
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr
              key={r}
              style={
                hiRows.has(r)
                  ? { backgroundColor: "var(--accent-dim)" }
                  : undefined
              }
            >
              {row.map((cell, c) => (
                <td
                  key={c}
                  className="border-b border-[var(--border)] px-3 py-2 font-mono text-[13px] text-[var(--fg-0)]"
                  style={
                    hiCols.has(c) && !hiRows.has(r)
                      ? { backgroundColor: "var(--accent-dim)" }
                      : undefined
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </FigureFrame>
  )
}
