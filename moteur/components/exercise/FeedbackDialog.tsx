"use client"

import Link from "next/link"
import { AlertCircleIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { isSelfGraded, type Exercise } from "@/lib/course"
import type { ValidationResult } from "@/lib/validators"
import { PromptRenderer } from "./PromptRenderer"

const TONES = {
  success: CheckCircle2Icon,
  warning: AlertCircleIcon,
  error: XCircleIcon,
}

// Graded by reading the answer: naming what is missing helps without giving the answer away.
const LISTS_MISSING_POINTS = [
  "SQL_DDL",
  "PLSQL_BLOCK",
  "PLSQL_TRIGGER",
  "PLSQL_PROCEDURE",
  "RUBRIC_OPEN",
]

export function FeedbackDialog({
  exercise,
  result,
  open,
  onOpenChange,
  onRetry,
  next,
  courseHref,
}: {
  exercise: Exercise
  result: ValidationResult
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Left out where a wrong answer moves on instead of being tried again. */
  onRetry?: () => void
  next: { label: string; href?: string; onClick?: () => void }
  courseHref: string
}) {
  const { passed, score } = result
  const tone = passed ? "success" : score > 0 ? "warning" : "error"
  const ToneIcon = TONES[tone]
  // A wrong answer only gets the hint: the explanation would give the answer away.
  const reminder =
    passed || isSelfGraded(exercise.type) ? exercise.explanation : exercise.hint
  const missing =
    !passed && LISTS_MISSING_POINTS.includes(exercise.type)
      ? result.feedback.filter((f) => !f.ok)
      : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-tone={tone}
        style={{
          borderTop: `4px solid var(--${tone})`,
          background: `color-mix(in oklab, var(--${tone}) 7%, var(--bg-1))`,
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ToneIcon
              className="size-5 shrink-0"
              style={{ color: `var(--${tone})` }}
            />
            {passed
              ? "Bonne réponse"
              : score > 0
                ? `Presque : ${Math.round(score * 100)} %`
                : "Pas encore"}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 text-sm leading-relaxed text-[var(--fg-1)]">
              <div className="mono-label">Rappel de cours</div>
              <PromptRenderer
                source={
                  reminder ?? "Relis le cours de ce chapitre, puis réessaie."
                }
              />
              {missing.length > 0 && (
                <ul className="list-disc space-y-1 pl-4">
                  {missing.map((f) => (
                    <li key={f.criterion}>
                      {f.criterion}
                      {f.detail && (
                        <span className="text-[var(--fg-2)]">
                          {" "}
                          — {f.detail}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        {passed && exercise.source && (
          <p className="mono-label">Source : {exercise.source}</p>
        )}
        <DialogFooter>
          {!passed && (
            <Button variant="outline" asChild>
              <Link href={courseHref}>Revoir le cours</Link>
            </Button>
          )}
          {!passed && onRetry ? (
            <Button onClick={onRetry}>Réessayer</Button>
          ) : next.href ? (
            <Button asChild>
              <Link href={next.href}>{next.label}</Link>
            </Button>
          ) : (
            <Button onClick={next.onClick}>{next.label}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
