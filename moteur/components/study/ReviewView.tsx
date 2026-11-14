"use client"

import Link from "next/link"
import { BookOpenIcon, FileTextIcon, FlameIcon, RepeatIcon } from "lucide-react"
import { useProgress } from "@/components/use-progress"
import { ModuleSidebar } from "@/components/study/ModuleSidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ConceptInfo } from "@/lib/course"
import { getDueConcepts } from "@/lib/progress"

export function ReviewView({ concepts }: { concepts: ConceptInfo[] }) {
  const { data, masteredCount } = useProgress()
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now()
  const due = getDueConcepts(concepts, data.mastery, now)
  const totalConcepts = concepts.length
  const overdueCount = Object.values(data.mastery).filter(
    (m) => m.dueAt && new Date(m.dueAt).getTime() <= now - 24 * 3600 * 1000
  ).length

  return (
    <div className="flex min-h-svh">
      <ModuleSidebar />
      <main className="mx-auto max-w-4xl px-8 py-12">
        <Link href="/" className="mono-label hover:text-[var(--fg-0)]">
          ← accueil
        </Link>
        <div className="mt-3 flex items-baseline justify-between border-b border-[var(--border)] pb-3">
          <div>
            <h1 className="font-mono text-3xl tracking-tight">Révision</h1>
            <p className="mt-1 text-xs text-[var(--fg-2)]">
              File de révision basée sur la maîtrise des concepts (SM-2 spaced
              repetition).
            </p>
          </div>
          <div className="font-mono text-xs text-[var(--fg-2)] tabular-nums">
            {masteredCount} / {totalConcepts} maîtrisés
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <Card
            label="À réviser"
            value={due.length.toString()}
            highlight={due.length > 0}
            icon={<RepeatIcon className="size-3.5" />}
          />
          <Card
            label="En retard"
            value={overdueCount.toString()}
            highlight={overdueCount > 0}
            warning
            icon={<FlameIcon className="size-3.5" />}
          />
          <Card
            label="Maîtrisés"
            value={`${masteredCount}/${totalConcepts}`}
            icon={<BookOpenIcon className="size-3.5" />}
          />
        </div>

        {due.length === 0 ? (
          <div className="card-elevated mt-12 p-10 text-center">
            <FlameIcon className="mx-auto size-9 text-[var(--accent)]" />
            <h2 className="mt-4 font-mono text-xl tracking-tight">
              Tout est à jour
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-2)]">
              {
                "Aucun concept à réviser pour aujourd'hui. Reviens demain pour la prochaine fournée, ou continue à débloquer de nouveaux modules."
              }
            </p>
            <Button asChild className="mt-6">
              <Link href="/modules">Continuer le parcours</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10">
            <h2 className="mono-label mb-3">À réviser ({due.length})</h2>
            <ul className="space-y-2">
              {due.map(({ concept, mastery: m }) => {
                const overdueDays = m.dueAt
                  ? Math.floor(
                      (now - new Date(m.dueAt).getTime()) / (24 * 3600 * 1000)
                    )
                  : 0
                return (
                  <li key={concept.slug} className="card-elevated">
                    <Link
                      href={`/review/concept/${concept.slug}`}
                      className="block px-4 py-3 transition-colors hover:bg-[var(--bg-2)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono text-xs text-[var(--fg-3)]">
                              {m.reps === 0 ? "0×" : `${m.reps}× passé`}
                            </span>
                            <h3 className="truncate font-mono text-sm">
                              {concept.label}
                            </h3>
                            {overdueDays > 1 && (
                              <Badge className="bg-[oklch(0.83_0.16_80_/_0.2)] font-mono text-[9px] text-[var(--warning)] hover:bg-[oklch(0.83_0.16_80_/_0.2)]">
                                +{overdueDays}j
                              </Badge>
                            )}
                          </div>
                          {concept.summary && (
                            <p className="mt-1 truncate text-xs text-[var(--fg-2)]">
                              {concept.summary}
                            </p>
                          )}
                          <div className="mt-2 flex gap-3 font-mono text-[10px] text-[var(--fg-3)]">
                            <span className="inline-flex items-center gap-1">
                              <BookOpenIcon className="size-2.5" />
                              {concept.sectionCount} théorie
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <FileTextIcon className="size-2.5" />
                              {concept.exerciseCount} exos
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-[var(--accent)]">
                          ease {m.ease.toFixed(2)} · int {m.interval}j
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}

function Card({
  label,
  value,
  icon,
  highlight,
  warning,
}: {
  label: string
  value: string
  icon: React.ReactNode
  highlight?: boolean
  warning?: boolean
}) {
  return (
    <div className="card-elevated p-4">
      <div className="mono-label flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div
        className={
          "mt-2 font-mono text-xl tabular-nums " +
          (warning && Number(value) > 0
            ? "text-[var(--warning)]"
            : highlight && Number(value) > 0
              ? "text-[var(--accent)]"
              : "")
        }
      >
        {value}
      </div>
    </div>
  )
}
