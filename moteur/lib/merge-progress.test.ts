import { describe, expect, it } from "vitest"
import { mergeProgress } from "./merge-progress"
import {
  EMPTY_PROGRESS,
  NEW_MASTERY,
  type Attempt,
  type GateRun,
} from "./store"

const attempt = (exerciseId: string, createdAt: string): Attempt => ({
  exerciseId,
  score: 1,
  passed: true,
  source: "PRACTICE",
  createdAt,
})
const run = (id: string, endedAt: string | null): GateRun => ({
  id,
  moduleSlug: "m1",
  startedAt: "2026-01-01",
  endedAt,
  score: null,
  passed: null,
})

describe("mergeProgress", () => {
  it("keeps the attempts of both devices once, in chronological order", () => {
    const shared = attempt("a", "2026-01-01")
    const merged = mergeProgress(
      { ...EMPTY_PROGRESS, attempts: [shared, attempt("c", "2026-01-03")] },
      { ...EMPTY_PROGRESS, attempts: [shared, attempt("b", "2026-01-02")] }
    )
    expect(merged.attempts.map((a) => a.exerciseId)).toEqual(["a", "b", "c"])
  })

  it("keeps the sections read on either device", () => {
    const merged = mergeProgress(
      { ...EMPTY_PROGRESS, sectionsRead: { s1: "2026-01-01" } },
      { ...EMPTY_PROGRESS, sectionsRead: { s2: "2026-01-02" } }
    )
    expect(Object.keys(merged.sectionsRead).sort()).toEqual(["s1", "s2"])
  })

  it("prefers the finished version of a run", () => {
    const merged = mergeProgress(
      { ...EMPTY_PROGRESS, gateRuns: [run("r", null)] },
      { ...EMPTY_PROGRESS, gateRuns: [run("r", "2026-01-02")] }
    )
    expect(merged.gateRuns).toEqual([run("r", "2026-01-02")])
  })

  it("does not lose a finished run to an unfinished copy", () => {
    const merged = mergeProgress(
      { ...EMPTY_PROGRESS, gateRuns: [run("r", "2026-01-02")] },
      { ...EMPTY_PROGRESS, gateRuns: [run("r", null)] }
    )
    expect(merged.gateRuns[0].endedAt).toBe("2026-01-02")
  })

  it("keeps the most advanced mastery of a concept", () => {
    const merged = mergeProgress(
      { ...EMPTY_PROGRESS, mastery: { c: { ...NEW_MASTERY, reps: 1 } } },
      { ...EMPTY_PROGRESS, mastery: { c: { ...NEW_MASTERY, reps: 3 } } }
    )
    expect(merged.mastery.c.reps).toBe(3)
  })
})
