"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { submitAttempt } from "@/lib/actions/attempts"
import { gradeConcept } from "@/lib/actions/review"
import { ExerciseRenderer } from "@/components/exercise/ExerciseRenderer"
import { FeedbackDialog } from "@/components/exercise/FeedbackDialog"
import { PromptRenderer } from "@/components/exercise/PromptRenderer"
import { EXERCISE_LABELS, type Exercise } from "@/lib/course"
import type { ValidationResult } from "@/lib/validators"
import type { AnySubmission } from "@/lib/validators/types"
import { cn } from "@/lib/utils"

export function ConceptDrillRunner({
  conceptSlug,
  exercises,
}: {
  conceptSlug: string
  exercises: Exercise[]
}) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [submission, setSubmission] = useState<AnySubmission | null>(null)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [scores, setScores] = useState<number[]>([])

  const current = exercises[index]
  const isLast = index === exercises.length - 1

  const handleVerify = () => {
    if (!submission) {
      toast.error("Réponse vide")
      return
    }
    startTransition(async () => {
      const res = await submitAttempt({
        exercise: current,
        submission,
        source: "REVIEW",
      })
      setResult(res)
      setDialogOpen(true)
      setScores([...scores, res.score])
    })
  }

  const handleNext = () => {
    setSubmission(null)
    setResult(null)
    setDialogOpen(false)
    if (isLast) {
      // Compute aggregate quality and grade the concept
      const avg = scores.reduce((s, x) => s + x, 0) / (scores.length || 1)
      const grade = Math.round(avg * 5) // map [0..1] to [0..5]
      gradeConcept(conceptSlug, grade)
      toast.success(`Concept mis à jour — note de rappel ${grade}/5`)
      router.push("/review")
    } else {
      setIndex(index + 1)
    }
  }

  const progress = ((index + (result ? 1 : 0)) / exercises.length) * 100

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-mono text-xs text-[var(--fg-2)] tabular-nums">
          {index + 1} / {exercises.length}
        </span>
        <div className="flex gap-1">
          {exercises.map((_, i) => (
            <span
              key={i}
              className={cn(
                "size-2 rounded-full",
                i < index
                  ? scores[i] >= 0.7
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--error)]"
                  : i === index
                    ? "bg-[var(--fg-2)]"
                    : "bg-[var(--bg-3)]"
              )}
            />
          ))}
        </div>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-2)]">
        <div
          className="h-full bg-[var(--accent)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="card-elevated mt-6 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-[var(--border-strong)] font-mono text-[10px]"
          >
            {EXERCISE_LABELS[current.type]}
          </Badge>
          <span className="font-mono text-[10px] text-[var(--fg-3)]">
            ★{current.difficulty} · {current.points}pt
          </span>
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
            disabled={result !== null || pending}
            onChange={setSubmission}
          />
        </div>
      </div>

      {result && (
        <FeedbackDialog
          exercise={current}
          result={result}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          next={{
            label: isLast ? "Terminer la révision" : "Suivant",
            onClick: handleNext,
          }}
          courseHref={`/modules/${current.moduleSlug}/chapter/${current.chapterSlug}`}
        />
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        {result ? (
          <Button onClick={handleNext} disabled={pending}>
            {pending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowRightIcon className="size-4" />
            )}
            {isLast ? "Terminer la révision" : "Suivant"}
          </Button>
        ) : (
          <Button onClick={handleVerify} disabled={pending || !submission}>
            {pending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <CheckCircle2Icon className="size-4" />
            )}
            Vérifier
          </Button>
        )}
      </div>
    </div>
  )
}
