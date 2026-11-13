import type { Exercise } from "@/lib/course"
import { newRunId, useProgressStore } from "@/lib/store"

export function startExamRun(examSlug: string): string {
  const id = newRunId()
  useProgressStore.setState((s) => ({
    examRuns: [
      ...s.examRuns,
      {
        id,
        examSlug,
        startedAt: new Date().toISOString(),
        endedAt: null,
        score: null,
        noteSur20: null,
      },
    ],
  }))
  return id
}

export function submitExamRun(
  runId: string,
  exercises: Pick<Exercise, "id" | "points">[]
) {
  useProgressStore.setState((s) => {
    const attempts = s.attempts.filter((a) => a.runId === runId)

    let totalPointsAwarded = 0
    let totalPointsAvailable = 0
    for (const ex of exercises) {
      totalPointsAvailable += ex.points
      const attempt = attempts.find((a) => a.exerciseId === ex.id)
      if (attempt) totalPointsAwarded += ex.points * attempt.score
    }
    const score = totalPointsAvailable
      ? totalPointsAwarded / totalPointsAvailable
      : 0

    return {
      examRuns: s.examRuns.map((r) =>
        r.id === runId && !r.endedAt
          ? {
              ...r,
              endedAt: new Date().toISOString(),
              score,
              noteSur20: score * 20,
            }
          : r
      ),
    }
  })
}
