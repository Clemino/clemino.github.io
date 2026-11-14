"use client"

import Link from "next/link"
import { CheckIcon, CircleIcon, LockIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgress } from "@/components/use-progress"

/** The course's modules with their state, shared by the sidebar and the mobile menu. */
export function ModuleList({
  activeSlug,
  onNavigate,
}: {
  activeSlug?: string
  onNavigate?: () => void
}) {
  const { modules } = useProgress()

  return (
    <ul className="space-y-0.5">
      {modules.map((m) => {
        const isActive = activeSlug === m.slug
        const pct =
          m.exercisesTotal > 0 ? (m.exercisesDone / m.exercisesTotal) * 100 : 0
        return (
          <li key={m.slug}>
            <Link
              onClick={onNavigate}
              href={m.unlocked ? `/modules/${m.slug}` : "#"}
              aria-disabled={!m.unlocked}
              className={cn(
                "group flex items-start gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                isActive ? "bg-[var(--bg-2)]" : "hover:bg-[var(--bg-2)]/60",
                !m.unlocked && "cursor-not-allowed opacity-60"
              )}
            >
              <div className="mt-0.5 flex size-4 items-center justify-center">
                {m.completed ? (
                  <div className="flex size-4 items-center justify-center rounded-full bg-[var(--accent)]">
                    <CheckIcon
                      className="size-2.5 text-[var(--accent-fg)]"
                      strokeWidth={3}
                    />
                  </div>
                ) : m.unlocked ? (
                  <CircleIcon className="size-3.5 text-[var(--fg-2)]" />
                ) : (
                  <LockIcon className="size-3 text-[var(--fg-3)]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] text-[var(--fg-3)] tabular-nums">
                    {String(m.order).padStart(2, "0")}
                  </span>
                  <span className="truncate text-xs">{m.title}</span>
                </div>
                {m.unlocked && !m.completed && (
                  <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-[var(--bg-3)]">
                    <div
                      className="h-full bg-[var(--accent)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
