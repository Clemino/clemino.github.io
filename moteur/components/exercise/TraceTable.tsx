"use client"

export function TraceTable({
  payload,
  output,
  onChange,
  disabled,
}: {
  payload: { format: "table" | "text"; columns?: string[] }
  output: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  return (
    <div className="space-y-2">
      <div className="font-mono text-[10px] tracking-wider text-[var(--fg-2)] uppercase">
        {payload.format === "table"
          ? "Sortie attendue (tableau)"
          : "Sortie attendue (texte)"}
      </div>
      <textarea
        disabled={disabled}
        value={output}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder={
          payload.format === "table"
            ? "ligne1col1 | ligne1col2\nligne2col1 | ligne2col2"
            : "Décris la sortie attendue..."
        }
        className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-3 font-mono text-[13px] text-[var(--fg-0)] outline-none focus:border-[var(--accent)]"
      />
    </div>
  )
}
