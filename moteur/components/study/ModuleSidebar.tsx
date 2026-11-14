"use client"

import Link from "next/link"
import { LockIcon, CheckIcon, CircleIcon } from "lucide-react"
import { COURSE } from "@/content/course"
import { cn } from "@/lib/utils"
import { useProgress } from "@/components/use-progress"

export function ModuleSidebar({ activeSlug }: { activeSlug?: string }) {
  const { modules } = useProgress()

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-1)] md:flex">
      <Link
        href="/"
        className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3"
      >
        <div className="flex size-6 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-fg)]">
          <COURSE.icon className="size-3.5" strokeWidth={2.5} />
        </div>
        <span className="font-mono text-sm">
          <span className="font-semibold">{COURSE.id}</span>
          <span className="text-[var(--fg-2)]">.app</span>
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-2 px-2 font-mono text-[10px] tracking-widest text-[var(--fg-3)] uppercase">
          Parcours
        </div>
        <ul className="space-y-0.5">
          {modules.map((m) => {
            const isActive = activeSlug === m.slug
            const pct =
              m.exercisesTotal > 0
                ? (m.exercisesDone / m.exercisesTotal) * 100
                : 0
            return (
              <li key={m.slug}>
                <Link
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

        <div className="mt-6 mb-2 px-2 font-mono text-[10px] tracking-widest text-[var(--fg-3)] uppercase">
          Outils
        </div>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/review"
              className="block rounded-md px-2 py-1.5 text-xs hover:bg-[var(--bg-2)]/60"
            >
              Révision
            </Link>
          </li>
          <li>
            <Link
              href="/exam"
              className="block rounded-md px-2 py-1.5 text-xs hover:bg-[var(--bg-2)]/60"
            >
              Examens blancs
            </Link>
          </li>
          <li>
            <Link
              href="/stats"
              className="block rounded-md px-2 py-1.5 text-xs hover:bg-[var(--bg-2)]/60"
            >
              Statistiques
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="block rounded-md px-2 py-1.5 text-xs hover:bg-[var(--bg-2)]/60"
            >
              Réglages
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border-t border-[var(--border)] px-4 py-2 font-mono text-[10px] text-[var(--fg-3)]">
        <kbd className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-1">
          d
        </kbd>{" "}
        toggle theme
      </div>
    </aside>
  )
}
