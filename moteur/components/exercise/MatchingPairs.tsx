"use client"

import { useMemo } from "react"
import { shuffled } from "@/lib/shuffle"
import { cn } from "@/lib/utils"

type Item = { id: string; label: string }

export function MatchingPairs({
  payload,
  pairs,
  onChange,
  disabled,
}: {
  payload: { left: Item[]; right: Item[] }
  pairs: Record<string, string>
  onChange: (v: Record<string, string>) => void
  disabled: boolean
}) {
  const right = useMemo(() => shuffled(payload.right), [payload.right])
  const update = (leftId: string, rightId: string) => onChange({ ...pairs, [leftId]: rightId })

  return (
    <div className="space-y-2">
      {payload.left.map((l) => (
        <div key={l.id} className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-3">
          <div className="flex-1 text-sm">{l.label}</div>
          <span className="font-mono text-xs text-[var(--fg-3)]">↔</span>
          <select
            disabled={disabled}
            value={pairs[l.id] ?? ""}
            onChange={(e) => update(l.id, e.target.value)}
            className={cn(
              "min-w-48 rounded-sm border border-[var(--border-strong)] bg-[var(--bg-2)] px-3 py-1.5 font-mono text-xs text-[var(--fg-0)] outline-none focus:border-[var(--accent)]",
              disabled && "cursor-not-allowed opacity-80",
            )}
          >
            <option value="">— choisir —</option>
            {right.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
