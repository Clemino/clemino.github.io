import { GATE_SIZE } from "@/lib/course"
import type { ModuleSummary } from "@/lib/progress"
import { shuffled } from "@/lib/shuffle"
import {
  EMPTY_PROGRESS,
  newRunId,
  useProgressStore,
  type Attempt,
} from "@/lib/store"

export function markSectionRead(sectionId: string) {
  useProgressStore.setState((s) => ({
    sectionsRead: { ...s.sectionsRead, [sectionId]: new Date().toISOString() },
  }))
}

export function startGateRun(moduleSlug: string, poolIds: string[]): string {
  const id = newRunId()
  useProgressStore.setState((s) => ({
    gateRuns: [
      ...s.gateRuns,
      {
        id,
        moduleSlug,
        exerciseIds: shuffled(poolIds).slice(0, GATE_SIZE),
        startedAt: new Date().toISOString(),
        endedAt: null,
        score: null,
        passed: null,
      },
    ],
  }))
  return id
}

export function submitGateRun(runId: string, threshold: number) {
  useProgressStore.setState((s) => {
    const attempts = s.attempts.filter((a) => a.runId === runId)
    const score = attempts.length
      ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
      : 0
    return {
      gateRuns: s.gateRuns.map((r) =>
        r.id === runId && !r.endedAt
          ? {
              ...r,
              endedAt: new Date().toISOString(),
              score,
              passed: score >= threshold,
            }
          : r
      ),
    }
  })
}

function skipAttempt(exerciseId: string, createdAt: string): Attempt {
  return { exerciseId, score: 1, passed: true, source: "SKIP", createdAt }
}

/** Counts the exercise as validated, without crediting any concept mastery. */
export function skipExercise(exerciseId: string) {
  useProgressStore.setState((s) => ({
    attempts: [
      ...s.attempts,
      skipAttempt(exerciseId, new Date().toISOString()),
    ],
  }))
}

export function skipModule({
  slug,
  chapters,
}: {
  slug: string
  chapters: Pick<
    ModuleSummary["chapters"][number],
    "sectionIds" | "exerciseIds"
  >[]
}) {
  const now = new Date().toISOString()
  const sections = chapters.flatMap((c) => c.sectionIds)
  const exercises = chapters.flatMap((c) => c.exerciseIds)
  useProgressStore.setState((s) => ({
    sectionsRead: {
      ...Object.fromEntries(sections.map((id) => [id, now])),
      ...s.sectionsRead,
    },
    attempts: [...s.attempts, ...exercises.map((id) => skipAttempt(id, now))],
    gateRuns: [
      ...s.gateRuns,
      {
        id: newRunId(),
        moduleSlug: slug,
        startedAt: now,
        endedAt: now,
        score: null,
        passed: true,
      },
    ],
  }))
}

export function resetAllProgress() {
  useProgressStore.setState(EMPTY_PROGRESS)
}
