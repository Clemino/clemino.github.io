"use client"

import { CheckIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function TrueFalse({
  value,
  onChange,
  disabled,
}: {
  value: boolean | null
  onChange: (v: boolean) => void
  disabled: boolean
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Btn label="Vrai" active={value === true} accent disabled={disabled} onClick={() => onChange(true)} icon={<CheckIcon className="size-5" />} />
      <Btn label="Faux" active={value === false} disabled={disabled} onClick={() => onChange(false)} icon={<XIcon className="size-5" />} />
    </div>
  )
}

function Btn({
  label,
  active,
  accent,
  disabled,
  onClick,
  icon,
}: {
  label: string
  active: boolean
  accent?: boolean
  disabled: boolean
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-md border px-6 py-6 font-mono text-base transition-colors",
        active
          ? accent
            ? "border-[var(--accent)] bg-[var(--accent-dim)]/30 text-[var(--accent)]"
            : "border-[var(--fg-1)] bg-[var(--bg-2)] text-[var(--fg-0)]"
          : "border-[var(--border)] bg-[var(--bg-1)] text-[var(--fg-1)] hover:bg-[var(--bg-2)]",
        disabled && "cursor-not-allowed opacity-80",
      )}
    >
      {icon}
      {label}
    </button>
  )
}
