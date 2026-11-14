"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  TrophyIcon,
  XCircleIcon,
} from "lucide-react"
import { useProgress } from "@/components/use-progress"
import { ModuleSidebar } from "@/components/study/ModuleSidebar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import type { ExamInfo, Exercise } from "@/lib/course"
import type { Attempt } from "@/lib/store"
import { canonicalSolution } from "@/lib/validators/canonical"

export function ExamResult({
  exam,
  exercises: ordered,
}: {
  exam: ExamInfo
  exercises: Exercise[]
}) {
  const router = useRouter()
  const runId = useSearchParams().get("run")
  const { data } = useProgress()
  const run = data.examRuns.find((r) => r.id === runId)
  const missing = data.hydrated && !run

  useEffect(() => {
    if (missing) router.replace(`/exam/${exam.slug}`)
  }, [missing, exam.slug, router])

  if (!run) return null

  // Attempts are chronological: the last one during this run is the official one
  const attemptByExercise = new Map<string, Attempt>()
  for (const a of data.attempts) {
    if (a.runId === run.id) attemptByExercise.set(a.exerciseId, a)
  }

  const note = run.noteSur20 ?? 0
  const grade =
    note >= 18
      ? { label: "Excellent", color: "var(--accent)" }
      : note >= 14
        ? { label: "Très bien", color: "var(--accent)" }
        : note >= 10
          ? { label: "Passé", color: "var(--success)" }
          : note >= 7
            ? { label: "Insuffisant", color: "var(--warning)" }
            : { label: "Très insuffisant", color: "var(--error)" }

  const totalAnswered = attemptByExercise.size
  const passedCount = Array.from(attemptByExercise.values()).filter(
    (a) => a.passed
  ).length

  return (
    <div className="flex min-h-svh">
      <ModuleSidebar />
      <main className="mx-auto max-w-3xl px-8 py-12">
        <Link
          href={`/exam/${exam.slug}`}
          className="mono-label hover:text-[var(--fg-0)]"
        >
          ← {exam.title}
        </Link>

        <div className="card-elevated mt-8 p-8 text-center">
          <TrophyIcon className="mx-auto size-9 text-[var(--accent)]" />
          <h1 className="mt-5 font-mono text-2xl tracking-tight">
            {"Résultat de l'examen"}
          </h1>
          <div
            className="mt-6 font-mono text-7xl tracking-tighter tabular-nums"
            style={{ color: grade.color }}
          >
            {note.toFixed(1)}
            <span className="text-3xl text-[var(--fg-3)]">/20</span>
          </div>
          <div className="mono-label mt-3" style={{ color: grade.color }}>
            {grade.label}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-left">
            <div className="card-elevated p-3">
              <div className="mono-label">Répondues</div>
              <div className="mt-1 font-mono text-xl tabular-nums">
                {totalAnswered}/{ordered.length}
              </div>
            </div>
            <div className="card-elevated p-3">
              <div className="mono-label">Validées</div>
              <div className="mt-1 font-mono text-xl text-[var(--accent)] tabular-nums">
                {passedCount}
              </div>
            </div>
            <div className="card-elevated p-3">
              <div className="mono-label">Durée</div>
              <div className="mt-1 font-mono text-xl tabular-nums">
                {run.endedAt && run.startedAt
                  ? `${Math.round((new Date(run.endedAt).getTime() - new Date(run.startedAt).getTime()) / 60000)} min`
                  : "—"}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/exam/${exam.slug}`}>Retenter</Link>
            </Button>
            <Button asChild>
              <Link href="/exam">Autres partiels</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mono-label mb-3">Corrigé question par question</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {ordered.map((ex, i) => {
              const attempt = attemptByExercise.get(ex.id)
              const passed = attempt?.passed ?? false
              const score = attempt?.score ?? 0
              return (
                <AccordionItem
                  key={ex.id}
                  value={ex.id}
                  className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-1)]"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-[var(--bg-2)]">
                    <div className="flex flex-1 items-center gap-3 text-left">
                      {!attempt ? (
                        <span className="size-4 rounded-full border border-[var(--border-strong)]" />
                      ) : passed ? (
                        <CheckCircle2Icon className="size-4 shrink-0 text-[var(--accent)]" />
                      ) : (
                        <XCircleIcon className="size-4 shrink-0 text-[var(--error)]" />
                      )}
                      <span className="font-mono text-[11px] text-[var(--fg-3)] tabular-nums">
                        Q{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 truncate font-mono text-xs text-[var(--fg-1)]">
                        {ex.prompt.split("\n")[0].slice(0, 80)}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--fg-2)]">
                        {attempt
                          ? `${Math.round(score * ex.points * 10) / 10}/${ex.points}pt`
                          : "non répondue"}
                      </span>
                      <ChevronDownIcon className="size-4 shrink-0 text-[var(--fg-3)] transition-transform [&[data-state=open]]:rotate-180" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border-t border-[var(--border)] bg-[var(--bg-0)] px-4 py-3 text-xs">
                    <div className="mono-label mb-2">Énoncé</div>
                    <pre className="overflow-x-auto whitespace-pre-wrap text-[var(--fg-1)]">
                      {ex.prompt}
                    </pre>
                    <div className="mono-label mt-4 mb-2">
                      Solution canonique
                    </div>
                    <pre className="overflow-x-auto rounded-sm bg-[var(--bg-2)] p-3 font-mono text-[12px] whitespace-pre-wrap text-[var(--fg-0)]">
                      <code>
                        {canonicalSolution(ex.type, ex.payload, ex.solution)}
                      </code>
                    </pre>
                    <div className="mono-label mt-4 mb-2">Explication</div>
                    <p className="leading-relaxed text-[var(--fg-1)]">
                      {ex.explanation}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </main>
    </div>
  )
}
