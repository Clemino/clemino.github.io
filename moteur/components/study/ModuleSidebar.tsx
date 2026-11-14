"use client"

import Link from "next/link"
import { COURSE } from "@/content/course"
import { ModuleList } from "@/components/study/ModuleList"

export function ModuleSidebar({ activeSlug }: { activeSlug?: string }) {
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
        <ModuleList activeSlug={activeSlug} />

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
