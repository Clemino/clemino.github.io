"use client"

export function RubricOpen({
  payload,
  text,
  onChange,
  disabled,
}: {
  payload: { minWords?: number }
  text: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  const words = text.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-2">
      <textarea
        disabled={disabled}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Réponds en quelques phrases. Cite les mots-clés du cours."
        className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-3 text-[14px] leading-relaxed text-[var(--fg-0)] outline-none focus:border-[var(--accent)]"
      />
      <div className="flex items-center justify-between font-mono text-[10px] text-[var(--fg-3)]">
        <span>{words} mots</span>
        {payload.minWords && (
          <span className={words < payload.minWords ? "text-[var(--warning)]" : "text-[var(--success)]"}>
            min {payload.minWords}
          </span>
        )}
      </div>
    </div>
  )
}
