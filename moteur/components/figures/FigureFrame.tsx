"use client"

import type { ReactNode } from "react"

/**
 * Shared chrome for every figure: a bordered card with an optional caption
 * footer and a horizontally-scrollable body so wide figures never overflow
 * their container. Mirrors the header/border treatment of `CodeBlock`.
 */
export function FigureFrame({
  label,
  caption,
  children,
}: {
  /** Short mono-caps label shown in the header bar. */
  label: string
  caption?: string
  children: ReactNode
}) {
  return (
    <figure className="my-4 overflow-hidden rounded-md border border-[var(--border)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5">
        <span className="font-mono text-[10px] tracking-wider text-[var(--fg-2)] uppercase">
          {label}
        </span>
      </div>
      <div className="overflow-x-auto bg-[var(--bg-1)] p-4">{children}</div>
      {caption && (
        <figcaption className="border-t border-[var(--border)] bg-[var(--bg-1)] px-3 py-2 text-[12px] text-[var(--fg-2)] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
