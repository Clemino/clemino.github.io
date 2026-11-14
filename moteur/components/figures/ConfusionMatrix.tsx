"use client"

import { FigureFrame } from "./FigureFrame"

/**
 * An n×n confusion matrix for evaluation-metrics exercises. Rows are the true
 * class ("Réel"), columns the predicted class ("Prédit"); the diagonal
 * (correct predictions) is emphasized with the accent colour.
 */
export function ConfusionMatrix({
  classes,
  matrix,
  caption,
}: {
  classes: string[]
  matrix: number[][]
  caption?: string
}) {
  return (
    <FigureFrame label="Matrice de confusion" caption={caption}>
      <div className="flex gap-1.5">
        {/* vertical "Réel" axis label */}
        <div className="flex items-center">
          <span
            className="font-mono text-[10px] tracking-wider text-[var(--fg-2)] uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Réel
          </span>
        </div>

        <div>
          {/* horizontal "Prédit" axis label */}
          <div className="mb-1 text-center font-mono text-[10px] tracking-wider text-[var(--fg-2)] uppercase">
            Prédit
          </div>

          <table className="border-collapse">
            <thead>
              <tr>
                <th className="p-0" aria-hidden="true" />
                {classes.map((c, i) => (
                  <th
                    key={i}
                    className="border border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5 font-mono text-[11px] font-medium text-[var(--fg-1)]"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classes.map((rowClass, r) => (
                <tr key={r}>
                  <th
                    scope="row"
                    className="border border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5 text-right font-mono text-[11px] font-medium text-[var(--fg-1)]"
                  >
                    {rowClass}
                  </th>
                  {classes.map((_, c) => {
                    const onDiagonal = r === c
                    const value = matrix[r]?.[c] ?? 0
                    return (
                      <td
                        key={c}
                        className="border border-[var(--border)] px-3 py-1.5 text-center font-mono text-[13px] tabular-nums"
                        style={
                          onDiagonal
                            ? {
                                backgroundColor: "var(--accent-dim)",
                                color: "var(--fg-0)",
                                fontWeight: 700,
                              }
                            : {
                                backgroundColor: "var(--bg-1)",
                                color: "var(--fg-1)",
                              }
                        }
                      >
                        {value}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </FigureFrame>
  )
}
