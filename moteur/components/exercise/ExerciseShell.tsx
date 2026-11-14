"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  Loader2Icon,
  RefreshCwIcon,
  SkipForwardIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProgress } from "@/components/use-progress"
import { submitAttempt } from "@/lib/actions/attempts"
import { skipExercise } from "@/lib/actions/progression"
import { celebratePass } from "@/lib/confetti"
import { EXERCISE_LABELS, type Exercise } from "@/lib/course"
import { nextStepAfterChapter } from "@/lib/progress"
import type { AttemptSource } from "@/lib/store"
import type { ValidationResult } from "@/lib/validators"
import type { AnySubmission } from "@/lib/validators/types"
import { ExerciseRenderer } from "./ExerciseRenderer"
import { FeedbackDialog } from "./FeedbackDialog"
import { PromptRenderer } from "./PromptRenderer"

export type ExerciseShellProps = {
  exercise: Exercise
  nextExerciseId?: string | null
  courseHref: string
  source?: AttemptSource
}

export function ExerciseShell({
  exercise,
  nextExerciseId,
  courseHref,
  source = "PRACTICE",
}: ExerciseShellProps) {
  const {
    id: exerciseId,
    type,
    difficulty,
    points,
    prompt,
    payload,
    moduleSlug,
    chapterSlug,
  } = exercise
  const router = useRouter()
  const { passedExercises, modules, chapters } = useProgress()
  const alreadyPassed = passedExercises.has(exerciseId)
  const [submission, setSubmission] = useState<AnySubmission | null>(null)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  // Remounts the answers on each try: they are shuffled again and local state is cleared.
  const [tryCount, setTryCount] = useState(0)
  const [pending, startTransition] = useTransition()

  const chapterHref = `/modules/${moduleSlug}/chapter/${chapterSlug}`
  const mod = modules.find((m) => m.slug === moduleSlug)
  const next = nextExerciseId
    ? {
        href: `${chapterHref}/exercises/${nextExerciseId}`,
        label: "Exercice suivant",
      }
    : mod && chapters[chapterSlug]?.completed
      ? nextStepAfterChapter(mod, chapterSlug)
      : { href: chapterHref, label: "Retour au chapitre" }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubmission(null)
    setResult(null)
    setDialogOpen(false)
  }, [exerciseId])

  const handleSubmit = () => {
    if (!submission) {
      toast.error("Réponse vide")
      return
    }
    startTransition(async () => {
      const res = await submitAttempt({ exercise, submission, source })
      setResult(res)
      setDialogOpen(true)
      if (res.passed && !alreadyPassed) celebratePass()
    })
  }

  const handleSkip = () => {
    skipExercise(exerciseId)
    router.push(
      nextExerciseId
        ? `${chapterHref}/exercises/${nextExerciseId}`
        : chapterHref
    )
  }

  const handleRetry = () => {
    setResult(null)
    setSubmission(null)
    setDialogOpen(false)
    setTryCount((n) => n + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-[var(--border-strong)] font-mono text-[10px]"
          >
            {EXERCISE_LABELS[type]}
          </Badge>
          <span className="font-mono text-[10px] text-[var(--fg-3)]">
            ★{difficulty} · {points}pt
          </span>
          {alreadyPassed && (
            <Badge className="bg-[var(--accent-dim)] font-mono text-[10px] text-[var(--accent)] hover:bg-[var(--accent-dim)]">
              passé
            </Badge>
          )}
        </div>
        <span className="font-mono text-[10px] text-[var(--fg-3)]">
          #{exerciseId.slice(0, 8)}
        </span>
      </div>

      <div className="card-elevated p-6">
        <div className="prose-tad text-[15px] leading-relaxed text-[var(--fg-0)]">
          <PromptRenderer source={prompt} />
        </div>

        <div className="mt-6">
          <ExerciseRenderer
            key={`${exerciseId}-${tryCount}`}
            type={type}
            payload={payload}
            solution={exercise.solution}
            submission={submission}
            disabled={result !== null || pending}
            onChange={setSubmission}
          />
        </div>
      </div>

      {result && (
        <FeedbackDialog
          exercise={exercise}
          result={result}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onRetry={handleRetry}
          next={next}
          courseHref={courseHref}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {result ? (
            <>
              <Button variant="outline" onClick={handleRetry}>
                <RefreshCwIcon className="size-4" />
                Réessayer
              </Button>
              {(result.passed || result.score >= 0.5) && (
                <Button asChild>
                  <Link href={next.href}>
                    {next.label}
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <Button onClick={handleSubmit} disabled={pending || !submission}>
              {pending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <CheckCircle2Icon className="size-4" />
              )}
              Vérifier
            </Button>
          )}
        </div>
        {!result && (
          <div className="flex flex-wrap items-center gap-1">
            {!alreadyPassed && (
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                <SkipForwardIcon className="size-3.5" />
                Passer et valider
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href={courseHref}>
                <BookOpenIcon className="size-3.5" />
                Revoir le cours
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
