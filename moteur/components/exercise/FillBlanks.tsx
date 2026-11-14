"use client"

import { cn } from "@/lib/utils"

type Slot = { id: string; width?: "sm" | "md" | "lg"; placeholder?: string }

function tokenize(
  template: string
): Array<{ kind: "text"; text: string } | { kind: "slot"; id: string }> {
  const out: Array<
    { kind: "text"; text: string } | { kind: "slot"; id: string }
  > = []
  const pattern = /\{\{([a-zA-Z0-9_]+)\}\}/g
  let lastIndex = 0
  for (const match of template.matchAll(pattern)) {
    const start = match.index ?? 0
    if (start > lastIndex)
      out.push({ kind: "text", text: template.slice(lastIndex, start) })
    out.push({ kind: "slot", id: match[1] })
    lastIndex = start + match[0].length
  }
  if (lastIndex < template.length)
    out.push({ kind: "text", text: template.slice(lastIndex) })
  return out
}

export function FillBlanks({
  payload,
  values,
  onChange,
  disabled,
}: {
  payload: { template: string; slots: Slot[] }
  values: Record<string, string>
  onChange: (v: Record<string, string>) => void
  disabled: boolean
}) {
  const update = (id: string, val: string) => onChange({ ...values, [id]: val })
  const parts = tokenize(payload.template)

  return (
    <pre className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-4 font-mono text-[13px] leading-relaxed">
      <code>
        {parts.map((p, i) => {
          if (p.kind === "text") return <span key={i}>{p.text}</span>
          const slot = payload.slots.find((s) => s.id === p.id)
          const w =
            slot?.width === "lg"
              ? "w-48"
              : slot?.width === "sm"
                ? "w-20"
                : "w-32"
          return (
            <input
              key={i}
              type="text"
              disabled={disabled}
              value={values[p.id] ?? ""}
              onChange={(e) => update(p.id, e.target.value)}
              placeholder={slot?.placeholder ?? p.id}
              autoComplete="off"
              spellCheck={false}
              className={cn(
                "inline-block rounded-sm border-b-2 border-[var(--accent)] bg-[var(--bg-2)] px-2 py-0.5 font-mono text-[13px] text-[var(--fg-0)] transition-colors outline-none focus:border-[var(--accent-hover)] focus:bg-[var(--bg-3)]",
                w
              )}
            />
          )
        })}
      </code>
    </pre>
  )
}
