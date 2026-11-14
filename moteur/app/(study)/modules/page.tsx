"use client"

import Link from "next/link"
import { ArrowRightIcon, CheckIcon, LockIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useProgress } from "@/components/use-progress"

export default function ModulesPage() {
  const { modules } = useProgress()

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <div className="mb-10 flex items-baseline justify-between border-b border-[var(--border)] pb-4">
        <div>
          <div className="mono-label">Parcours</div>
          <h1 className="mt-1 font-mono text-3xl tracking-tight">Modules</h1>
        </div>
        <div className="font-mono text-xs text-[var(--fg-2)]">
          {modules.filter((m) => m.completed).length} / {modules.length}{" "}
          complétés
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {modules.map((m) => (
          <Link
            key={m.slug}
            href={m.unlocked ? `/modules/${m.slug}` : "#"}
            aria-disabled={!m.unlocked}
            className={
              "group card-elevated relative block p-5 transition-all " +
              (m.unlocked
                ? "hover:border-[var(--border-strong)]"
                : "cursor-not-allowed opacity-60")
            }
          >
            <div className="flex items-start justify-between">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-[var(--fg-3)] tabular-nums">
                  {String(m.order).padStart(2, "0")}
                </span>
                {m.completed ? (
                  <Badge className="bg-[var(--accent-dim)] font-mono text-[10px] text-[var(--accent)] hover:bg-[var(--accent-dim)]">
                    <CheckIcon className="size-3" /> passé
                  </Badge>
                ) : m.unlocked ? (
                  <Badge
                    variant="outline"
                    className="border-[var(--border-strong)] font-mono text-[10px]"
                  >
                    en cours
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-[var(--border)] font-mono text-[10px] text-[var(--fg-3)]"
                  >
                    <LockIcon className="size-3" /> verrouillé
                  </Badge>
                )}
              </div>
              <ArrowRightIcon className="size-4 text-[var(--fg-3)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
            </div>
            <h3 className="mt-3 font-mono text-lg tracking-tight">{m.title}</h3>
            {m.subtitle && (
              <p className="mt-1 text-xs text-[var(--fg-2)]">{m.subtitle}</p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-[var(--fg-1)]">
              {m.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="flex gap-3 font-mono text-[var(--fg-2)] tabular-nums">
                <span>{m.chapterCount} ch.</span>
                <span>{m.sectionCount} sec.</span>
                <span>{m.exercisesTotal} ex.</span>
              </div>
              {m.unlocked && !m.completed && m.exercisesTotal > 0 && (
                <span className="font-mono text-[var(--accent)]">
                  {Math.round((m.exercisesDone / m.exercisesTotal) * 100)}%
                </span>
              )}
              {m.completed && m.bestGateScore != null && (
                <span className="font-mono text-[var(--accent)]">
                  gate {Math.round(m.bestGateScore * 100)}%
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
