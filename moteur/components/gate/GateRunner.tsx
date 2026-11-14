"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { ArrowRightIcon, FlagIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { submitAttempt } from "@/lib/actions/attempts"
import { submitGateRun } from "@/lib/actions/progression"
import { ExerciseRenderer } from "@/components/exercise/ExerciseRenderer"
import { PromptRenderer } from "@/components/exercise/PromptRenderer"
import { EXERCISE_LABELS, type Exercise } from "@/lib/course"
import type { AnySubmission } from "@/lib/validators/types"

export function GateRunner({
  runId,
  moduleSlug,
  exercises,
  threshold,
}: {
  runId: string
  moduleSlug: string
  exercises: Exercise[]
  threshold: number
}) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [submission, setSubmission] = useState<AnySubmission | null>(null)
  const [pending, startTransition] = useTransition()

  const current = exercises[index]
  const isLast = index === exercises.length - 1
  const progress = (index / exercises.length) * 100

  const handleNext = () => {
    if (!submission) {
      toast.error("Réponse vide")
      return
    }
    startTransition(async () => {
      await submitAttempt({
        exercise: current,
        submission,
        source: "GATE",
        runId,
      })
      setSubmission(null)
      if (isLast) {
        submitGateRun(runId, threshold)
        router.push(`/modules/${moduleSlug}/gate/result?run=${runId}`)
      } else {
        setIndex(index + 1)
      }
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-12">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="mono-label inline-flex items-center gap-1">
          <FlagIcon className="size-3" /> Gate {moduleSlug}
        </span>
        <span className="font-mono text-xs tabular-nums">
          {index + 1} / {exercises.length}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-2)]">
        <div
          className="h-full bg-[var(--accent)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="card-elevated mt-8 p-6">
        <div className="mono-label mb-2">
          {EXERCISE_LABELS[current.type]} · ★{current.difficulty} ·{" "}
          {current.points}pt
        </div>
        <div className="prose-tad text-[15px] leading-relaxed text-[var(--fg-0)]">
          <PromptRenderer source={current.prompt} />
        </div>
        <div className="mt-6">
          <ExerciseRenderer
            key={current.id}
            type={current.type}
            payload={current.payload}
            submission={submission}
            disabled={pending}
            onChange={setSubmission}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono text-[10px] text-[var(--fg-3)]">
          Pas de feedback intermédiaire · seuil {Math.round(threshold * 100)}%
        </span>
        <Button onClick={handleNext} disabled={pending || !submission}>
          {pending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <ArrowRightIcon className="size-4" />
          )}
          {isLast ? "Soumettre le gate" : "Question suivante"}
        </Button>
      </div>
    </div>
  )
}
