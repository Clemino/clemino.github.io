"use client"

export function ReadOnlyCodeBlock({
  code,
  language = "scala",
  label,
}: {
  code: string
  language?: string
  label?: string
}) {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-1)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-2)]">
          {label ?? "Extrait a analyser"}
        </span>
        <span className="font-mono text-[10px] text-[var(--fg-3)]">{language}</span>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-relaxed text-[var(--fg-0)]">
        <code>{code}</code>
      </pre>
    </div>
  )
}
