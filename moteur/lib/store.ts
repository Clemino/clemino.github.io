import { COURSE } from "@/content/course"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { AnySubmission } from "@/lib/validators/types"

export const PROGRESS_KEY = `${COURSE.id}-progress`

export type AttemptSource = "PRACTICE" | "GATE" | "REVIEW" | "EXAM" | "SKIP"

export type Attempt = {
  exerciseId: string
  score: number
  passed: boolean
  source: AttemptSource
  runId?: string
  /** Kept for gates only, to show the student what they answered. */
  submission?: AnySubmission
  createdAt: string
}

export type GateRun = {
  id: string
  moduleSlug: string
  exerciseIds?: string[]
  startedAt: string
  endedAt: string | null
  score: number | null
  passed: boolean | null
}

export type ExamRun = {
  id: string
  examSlug: string
  startedAt: string
  endedAt: string | null
  score: number | null
  noteSur20: number | null
}

export type Mastery = {
  ease: number
  interval: number
  reps: number
  dueAt: string | null
  lastGrade: number | null
}

export type ProgressData = {
  attempts: Attempt[]
  sectionsRead: Record<string, string>
  gateRuns: GateRun[]
  examRuns: ExamRun[]
  mastery: Record<string, Mastery>
}

export const EMPTY_PROGRESS: ProgressData = {
  attempts: [],
  sectionsRead: {},
  gateRuns: [],
  examRuns: [],
  mastery: {},
}

export const NEW_MASTERY: Mastery = {
  ease: 2.5,
  interval: 0,
  reps: 0,
  dueAt: null,
  lastGrade: null,
}

type ProgressStore = ProgressData & { hydrated: boolean }

/**
 * Rehydration is skipped at creation so the first client render matches the
 * prerendered HTML; CourseProvider triggers it after mount.
 */
export const useProgressStore = create<ProgressStore>()(
  persist((): ProgressStore => ({ ...EMPTY_PROGRESS, hydrated: false }), {
    name: PROGRESS_KEY,
    version: 1,
    storage: createJSONStorage(() => localStorage),
    skipHydration: true,
    partialize: ({ attempts, sectionsRead, gateRuns, examRuns, mastery }) => ({
      attempts,
      sectionsRead,
      gateRuns,
      examRuns,
      mastery,
    }),
    onRehydrateStorage: () => () =>
      useProgressStore.setState({ hydrated: true }),
  })
)

export function newRunId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}
