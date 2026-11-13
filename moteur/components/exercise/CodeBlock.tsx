"use client"

const LANGUAGE_LABEL: Record<string, string> = {
  python: "Python",
  r: "R",
  keras: "Keras",
  pseudocode: "Pseudocode",
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  highlightLines = [],
  annotations = [],
}: {
  code: string
  language?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  annotations?: { line: number; note: string }[]
}) {
  const label = language ? (LANGUAGE_LABEL[language] ?? language) : undefined
  const rawLines = code.split("\n")
  const lines =
    rawLines.length > 1 && rawLines[rawLines.length - 1] === ""
      ? rawLines.slice(0, -1)
      : rawLines
  const highlightSet = new Set(highlightLines)
  const annotationMap = new Map(annotations.map((a) => [a.line, a.note]))
  const hasAnnotations = annotations.length > 0

  return (
    <div className="overflow-hidden rounded-md border border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-2)]">
          {label ?? "Code"}
        </span>
        <span className="font-mono text-[10px] text-[var(--fg-3)]">
          {lines.length} ligne{lines.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Body */}
      <div
        className="overflow-x-auto bg-[var(--bg-1)]"
        role="region"
        aria-label={label ? `Bloc de code ${label}` : "Bloc de code"}
      >
        <table role="presentation" className="w-full border-collapse" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", lineHeight: "1.6" }}>
          <tbody>
            {lines.map((lineText, idx) => {
              const lineNumber = idx + 1
              const isHighlighted = highlightSet.has(lineNumber)
              const annotation = annotationMap.get(lineNumber)

              return (
                <tr
                  key={lineNumber}
                  style={
                    isHighlighted
                      ? { backgroundColor: "var(--accent-dim)" }
                      : undefined
                  }
                >
                  {/* Line number gutter */}
                  {showLineNumbers && (
                    <td
                      aria-hidden="true"
                      className="select-none border-r border-[var(--border)] px-3 py-0 text-right text-[var(--fg-3)]"
                      style={{ minWidth: "2.75rem" }}
                    >
                      {lineNumber}
                    </td>
                  )}

                  {/* Code content */}
                  <td className="px-3 py-0 text-[var(--fg-0)]">
                    <pre className="m-0 whitespace-pre" style={{ fontFamily: "inherit", fontSize: "inherit", background: "none" }}>
                      {lineText || " "}
                    </pre>
                  </td>

                  {/* Annotation column */}
                  {hasAnnotations && (
                    <td className="px-3 py-0 text-[var(--fg-3)] text-[11px] italic whitespace-nowrap">
                      {annotation ? (
                        <span className="rounded-[3px] bg-[var(--bg-2)] px-1.5 py-0.5">
                          {annotation}
                        </span>
                      ) : null}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
