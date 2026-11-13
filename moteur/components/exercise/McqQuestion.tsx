"use client"

import { useMemo } from "react"
import { CheckIcon } from "lucide-react"
import { shuffled } from "@/lib/shuffle"
import { cn } from "@/lib/utils"

type Option = { id: string; label: string }

export function McqQuestion({
  mode,
  payload,
  value,
  onChange,
  disabled,
}: {
  mode: "single" | "multi"
  payload: { options: Option[] }
  value: string[]
  onChange: (v: string[]) => void
  disabled: boolean
}) {
  const options = useMemo(() => shuffled(payload.options), [payload.options])

  const toggle = (id: string) => {
    if (disabled) return
    if (mode === "single") {
      onChange([id])
    } else {
      onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])
    }
  }

  return (
    <ul className="space-y-2" role="radiogroup">
      {options.map((opt, i) => {
        const selected = value.includes(opt.id)
        return (
          <li key={opt.id}>
            <button
              type="button"
              role={mode === "single" ? "radio" : "checkbox"}
              aria-checked={selected}
              disabled={disabled}
              onClick={() => toggle(opt.id)}
              className={cn(
                "group flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors",
                selected
                  ? "border-[var(--accent)] bg-[var(--accent-dim)]/30"
                  : "border-[var(--border)] bg-[var(--bg-1)] hover:bg-[var(--bg-2)]",
                disabled && "cursor-not-allowed opacity-90",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center border",
                  mode === "single" ? "rounded-full" : "rounded-[4px]",
                  selected
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "border-[var(--border-strong)]",
                )}
              >
                {selected && <CheckIcon className="size-3" strokeWidth={3} />}
              </div>
              <div className="flex items-baseline gap-2 flex-1 min-w-0">
                <span className="font-mono text-[10px] tabular-nums text-[var(--fg-3)]">
                  {String.fromCharCode(97 + i)})
                </span>
                <span className="text-sm leading-relaxed text-[var(--fg-0)]">{opt.label}</span>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
