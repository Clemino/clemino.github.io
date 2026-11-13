"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon, FlagIcon, Loader2Icon, SendHorizonalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { submitAttempt } from "@/lib/actions/attempts"
import { submitExamRun } from "@/lib/actions/exam"
import { ExerciseRenderer } from "@/components/exercise/ExerciseRenderer"
import { PromptRenderer } from "@/components/exercise/PromptRenderer"
import type { Exercise } from "@/lib/course"
import type { AnySubmission } from "@/lib/validators/types"
import { cn } from "@/lib/utils"

function formatTime(ms: number) {
  if (ms <= 0) return "00:00:00"
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  const s = Math.floor((ms % 60_000) / 1000)
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function ExamRunner({
  runId,
  examSlug,
  examTitle,
  exercises,
  deadlineMs,
  totalPoints,
}: {
  runId: string
  examSlug: string
  examTitle: string
  exercises: Exercise[]
  deadlineMs: number
  totalPoints: number
}) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  // Store submissions by exercise id (allow navigation back)
  const [submissions, setSubmissions] = useState<Record<string, AnySubmission | null>>({})
  const [remaining, setRemaining] = useState(() => Math.max(0, deadlineMs - Date.now()))
  const [submitting, startSubmitTransition] = useTransition()
  const submittingRef = useRef(false)

  const current = exercises[index]
  const isLast = index === exercises.length - 1
  const answered = useMemo(
    () => Object.values(submissions).filter((s) => s !== null && s !== undefined).length,
    [submissions],
  )
  const progress = (answered / exercises.length) * 100
  const totalEarnedPoints = useMemo(() => {
    let p = 0
    for (const e of exercises) if (submissions[e.id]) p += e.points
    return p
  }, [submissions, exercises])

  // Countdown
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, deadlineMs - Date.now())), 1000)
    return () => clearInterval(id)
  }, [deadlineMs])

  const setCurrentSubmission = (s: AnySubmission) => {
    setSubmissions((prev) => ({ ...prev, [current.id]: s }))
  }

  const handleSubmitExam = async (auto = false) => {
    submittingRef.current = true
    startSubmitTransition(async () => {
      // Submit all answered exercises (each one validates the answer) tagged to this run
      for (const ex of exercises) {
        const sub = submissions[ex.id]
        if (sub === null || sub === undefined) continue
        try {
          await submitAttempt({ exercise: ex, submission: sub, source: "EXAM", runId })
        } catch (e) {
          console.error("Failed to submit", ex.id, e)
        }
      }
      submitExamRun(runId, exercises)
      if (!auto) toast.success("Examen soumis")
      router.push(`/exam/${examSlug}/result?run=${runId}`)
    })
  }

  // Auto-submit when time is up
  useEffect(() => {
    if (remaining <= 0 && !submittingRef.current) {
      submittingRef.current = true
      toast.warning("Temps écoulé. Soumission automatique.")
      void handleSubmitExam(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  const handleNext = () => {
    if (!isLast) setIndex(index + 1)
  }
  const handlePrev = () => {
    if (index > 0) setIndex(index - 1)
  }

  const isTimeShort = remaining < 5 * 60_000

  return (
    <div className="min-h-svh bg-[var(--bg-0)]">
      {/* Fixed top bar with timer */}
      <header
        className={cn(
          "sticky top-0 z-30 border-b backdrop-blur",
          isTimeShort ? "border-[var(--error)]/40 bg-[oklch(0.68_0.22_25_/_0.08)]" : "border-[var(--border)] bg-[var(--bg-0)]/80",
        )}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-2">
            <FlagIcon className="size-4 text-[var(--accent)]" />
            <span className="font-mono text-sm">{examTitle}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-xs tabular-nums text-[var(--fg-2)]">
              {answered} / {exercises.length} répondues · {totalEarnedPoints} / {totalPoints} pts
            </div>
            <div className={cn("flex items-center gap-1.5 font-mono text-base tabular-nums", isTimeShort && "text-[var(--error)]")}>
              <ClockIcon className="size-4" />
              {formatTime(remaining)}
            </div>
          </div>
        </div>
        <div className="h-0.5 overflow-hidden bg-[var(--bg-2)]">
          <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Question navigator */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {exercises.map((e, i) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "flex size-7 items-center justify-center rounded-sm border font-mono text-[11px] tabular-nums transition-colors",
                i === index
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                  : submissions[e.id]
                    ? "border-[var(--accent-dim)] bg-[var(--accent-dim)]/30 text-[var(--fg-0)]"
                    : "border-[var(--border)] bg-[var(--bg-1)] text-[var(--fg-2)] hover:bg-[var(--bg-2)]",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="card-elevated p-6">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline" className="border-[var(--border-strong)] font-mono text-[10px]">
              Question {index + 1} / {exercises.length}
            </Badge>
            <span className="font-mono text-[10px] text-[var(--fg-3)]">
              {current.type.replace(/_/g, " ")} · ★{current.difficulty} · {current.points}pt
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
              submission={submissions[current.id] ?? null}
              disabled={submitting}
              onChange={setCurrentSubmission}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button variant="outline" onClick={handlePrev} disabled={index === 0 || submitting}>
            <ArrowLeftIcon className="size-4" />
            Précédent
          </Button>
          <Button variant="outline" onClick={() => handleSubmitExam(false)} disabled={submitting}>
            {submitting ? <Loader2Icon className="size-4 animate-spin" /> : <SendHorizonalIcon className="size-4" />}
            {"Soumettre l'examen"}
          </Button>
          <Button onClick={handleNext} disabled={isLast || submitting}>
            Suivant
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
