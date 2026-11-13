"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useProgress } from "@/components/use-progress"
import { ExamRunner } from "@/components/exam/ExamRunner"
import type { ExamInfo, Exercise } from "@/lib/course"

export function ExamRun({
  exam,
  exercises,
}: {
  exam: ExamInfo
  exercises: Exercise[]
}) {
  const router = useRouter()
  const runId = useSearchParams().get("run")
  const { data } = useProgress()
  const run = data.examRuns.find((r) => r.id === runId)

  let redirectTo: string | null = null
  if (data.hydrated) {
    if (!run) redirectTo = `/exam/${exam.slug}`
    else if (run.endedAt) redirectTo = `/exam/${exam.slug}/result?run=${run.id}`
  }

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo)
  }, [redirectTo, router])

  if (!run || run.endedAt) return null

  return (
    <ExamRunner
      runId={run.id}
      examSlug={exam.slug}
      examTitle={exam.title}
      exercises={exercises}
      deadlineMs={
        new Date(run.startedAt).getTime() + exam.durationMinutes * 60 * 1000
      }
      totalPoints={exam.totalPoints}
    />
  )
}
