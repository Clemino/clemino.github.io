import type { Attempt, Mastery, ProgressData } from "@/lib/store"

const attemptKey = (a: Attempt) => `${a.exerciseId}|${a.source}|${a.createdAt}`

function mergeRuns<T extends { id: string; endedAt: string | null }>(
  a: T[],
  b: T[]
): T[] {
  const byId = new Map(a.map((run) => [run.id, run]))
  for (const run of b) {
    const known = byId.get(run.id)
    if (!known || (!known.endedAt && run.endedAt)) byId.set(run.id, run)
  }
  return [...byId.values()]
}

function mergeMastery(
  a: Record<string, Mastery>,
  b: Record<string, Mastery>
): Record<string, Mastery> {
  const merged = { ...a }
  for (const [slug, mastery] of Object.entries(b)) {
    if (!merged[slug] || mastery.reps > merged[slug].reps)
      merged[slug] = mastery
  }
  return merged
}

/** Progress only grows, so two devices are reconciled by keeping everything either one recorded. */
export function mergeProgress(a: ProgressData, b: ProgressData): ProgressData {
  const attempts = new Map(
    [...a.attempts, ...b.attempts].map((attempt) => [
      attemptKey(attempt),
      attempt,
    ])
  )
  return {
    attempts: [...attempts.values()].sort((x, y) =>
      x.createdAt.localeCompare(y.createdAt)
    ),
    sectionsRead: { ...b.sectionsRead, ...a.sectionsRead },
    gateRuns: mergeRuns(a.gateRuns, b.gateRuns),
    examRuns: mergeRuns(a.examRuns, b.examRuns),
    mastery: mergeMastery(a.mastery, b.mastery),
  }
}
