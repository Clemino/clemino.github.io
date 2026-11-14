"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  ClockIcon,
  FlagIcon,
  LockIcon,
  TrophyIcon,
} from "lucide-react"
import { useProgress } from "@/components/use-progress"
import { ModuleSidebar } from "@/components/study/ModuleSidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ExamInfo } from "@/lib/course"
import { COURSE } from "@/content/course"

export function ExamIndexView({ exams }: { exams: ExamInfo[] }) {
  const { modules, data } = useProgress()
  const allCompleted = modules.every((m) => m.completed)

  return (
    <div className="flex min-h-svh">
      <ModuleSidebar />
      <main className="mx-auto max-w-4xl px-8 py-12">
        <Link href="/" className="mono-label hover:text-[var(--fg-0)]">
          ← accueil
        </Link>
        <h1 className="mt-3 font-mono text-3xl tracking-tight">
          Examens blancs
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-1)]">
          {COURSE.examIntro}
        </p>

        {!allCompleted && (
          <div className="card-elevated mt-8 p-5">
            <div className="flex items-start gap-3">
              <LockIcon className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" />
              <div>
                <div className="font-mono text-sm">
                  Accès libre sans avoir validé les {modules.length} modules
                </div>
                <p className="mt-1 text-xs text-[var(--fg-2)]">
                  Tu peux quand même essayer dès maintenant — utile pour mesurer
                  où tu en es. Termine les {modules.length} modules pour
                  débloquer le suivi de progression normal.
                </p>
              </div>
            </div>
          </div>
        )}

        <ul className="mt-10 space-y-3">
          {exams.map((exam) => {
            const last = data.examRuns
              .filter((r) => r.examSlug === exam.slug)
              .at(-1)
            return (
              <li key={exam.slug} className="card-elevated">
                <div className="px-5 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FlagIcon className="size-3.5 text-[var(--accent)]" />
                        <span className="mono-label">{exam.slug}</span>
                        {last?.endedAt && (
                          <Badge className="bg-[var(--accent-dim)] font-mono text-[10px] text-[var(--accent)] hover:bg-[var(--accent-dim)]">
                            <TrophyIcon className="size-3" />
                            {last.noteSur20?.toFixed(1)} / 20
                          </Badge>
                        )}
                      </div>
                      <h2 className="mt-2 font-mono text-lg tracking-tight">
                        {exam.title}
                      </h2>
                      <p className="mt-1 text-xs text-[var(--fg-2)]">
                        {exam.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 font-mono text-[10px] text-[var(--fg-3)] tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="size-3" />
                          {exam.durationMinutes} min
                        </span>
                        <span>{exam.questionCount} questions</span>
                        <span>{`noté /${exam.totalPoints}`}</span>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/exam/${exam.slug}`}>
                        {last && !last.endedAt ? "Reprendre" : "Commencer"}
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
