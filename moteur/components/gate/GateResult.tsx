"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2Icon, FlagIcon, XCircleIcon } from "lucide-react"
import { useProgress } from "@/components/use-progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { GateCelebration } from "@/components/gate/GateCelebration"
import type { Exercise } from "@/lib/course"
import { canonicalSolution, describeSubmission } from "@/lib/validators/canonical"

export function GateResult({
  moduleSlug,
  pool,
}: {
  moduleSlug: string
  pool: Exercise[]
}) {
  const router = useRouter()
  const runId = useSearchParams().get("run")
  const { data, modules } = useProgress()
  const run = data.gateRuns.find((r) => r.id === runId)
  const missing = data.hydrated && !run

  useEffect(() => {
    if (missing) router.replace(`/modules/${moduleSlug}/gate`)
  }, [missing, moduleSlug, router])

  const mod = modules.find((m) => m.slug === moduleSlug)
  if (!run || !mod) return null

  const score = run.score ?? 0
  const passed = run.passed ?? false
  const attempts = data.attempts.filter((a) => a.runId === run.id)
  const nextModule = modules.find((m) => m.order === mod.order + 1)

  return (
    <div className="mx-auto max-w-3xl px-8 py-12">
      {passed && <GateCelebration />}
      <Link href={`/modules/${moduleSlug}`} className="mono-label hover:text-[var(--fg-0)]">
        ← {mod.title}
      </Link>

      <div className="mt-8 card-elevated p-8 text-center">
        <div
          className={
            "mx-auto inline-flex size-16 items-center justify-center rounded-full " +
            (passed ? "bg-[var(--accent-dim)]/30 text-[var(--accent)]" : "bg-[oklch(0.68_0.22_25_/_0.1)] text-[var(--error)]")
          }
        >
          {passed ? <CheckCircle2Icon className="size-7" /> : <XCircleIcon className="size-7" />}
        </div>
        <h1 className="mt-6 font-mono text-3xl tracking-tight">
          {passed ? "Gate validé" : "Gate échoué"}
        </h1>
        <div className="mt-3 font-mono text-5xl tabular-nums text-[var(--accent)]">
          {Math.round(score * 100)}%
        </div>
        <p className="mt-3 text-sm text-[var(--fg-2)]">
          {passed
            ? `Module ${mod.title} complété. ${nextModule ? `Le module ${nextModule.title} est maintenant débloqué.` : "Tous les modules sont passés !"}`
            : `Score minimum requis : 80 %. Reviens sur les chapitres difficiles et réessaie.`}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button asChild variant={passed ? "outline" : "default"}>
            <Link href={`/modules/${moduleSlug}`}>Retour au module</Link>
          </Button>
          {passed && nextModule ? (
            <Button asChild>
              <Link href={`/modules/${nextModule.slug}`}>Module suivant <FlagIcon className="size-4" /></Link>
            </Button>
          ) : !passed ? (
            <Button asChild>
              <Link href={`/modules/${moduleSlug}/gate`}>Réessayer le gate</Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 mono-label">Détail des questions</h2>
        <Accordion
          type="multiple"
          defaultValue={attempts.filter((a) => !a.passed).map((a) => a.exerciseId)}
          className="space-y-2"
        >
          {attempts.map((a, i) => {
            const exercise = pool.find((e) => e.id === a.exerciseId)
            if (!exercise) return null
            return (
              <AccordionItem
                key={a.exerciseId}
                value={a.exerciseId}
                className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-1)]"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-[var(--bg-2)]">
                  <div className="flex flex-1 items-center gap-3 text-left text-sm">
                    {a.passed ? (
                      <CheckCircle2Icon className="size-4 shrink-0 text-[var(--accent)]" />
                    ) : (
                      <XCircleIcon className="size-4 shrink-0 text-[var(--error)]" />
                    )}
                    <span className="font-mono text-xs text-[var(--fg-3)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 truncate text-[var(--fg-1)]">{exercise.prompt.split("\n")[0].slice(0, 80)}</span>
                    <span className="font-mono text-[10px] text-[var(--fg-2)]">{Math.round(a.score * 100)}%</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t border-[var(--border)] bg-[var(--bg-0)] px-4 py-3 text-sm">
                  <div className="mono-label mb-1">Énoncé</div>
                  <p className="whitespace-pre-wrap text-[var(--fg-1)]">{exercise.prompt}</p>
                  <div className="mono-label mt-4 mb-1">Ta réponse</div>
                  <p className="whitespace-pre-wrap text-[var(--fg-0)]">
                    {describeSubmission(exercise.type, exercise.payload, a.submission)}
                  </p>
                  <div className="mono-label mt-4 mb-1">Bonne réponse</div>
                  <p className="whitespace-pre-wrap text-[var(--fg-0)]">
                    {canonicalSolution(exercise.type, exercise.payload, exercise.solution)}
                  </p>
                  <div className="mono-label mt-4 mb-1">Explication</div>
                  <p className="whitespace-pre-wrap leading-relaxed text-[var(--fg-1)]">{exercise.explanation}</p>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}
