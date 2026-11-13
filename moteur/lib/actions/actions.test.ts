import { beforeEach, describe, expect, it } from "vitest"
import { submitAttempt } from "@/lib/actions/attempts"
import { startExamRun, submitExamRun } from "@/lib/actions/exam"
import {
  markSectionRead,
  resetAllProgress,
  startGateRun,
  submitGateRun,
  skipExercise,
  skipModule,
} from "@/lib/actions/progression"
import { gradeConcept } from "@/lib/actions/review"
import type { Exercise } from "@/lib/course"
import { EMPTY_PROGRESS, PROGRESS_KEY, useProgressStore } from "@/lib/store"

const mcq = (id: string, over: Partial<Exercise> = {}): Exercise => ({
  id,
  moduleSlug: "m1",
  chapterSlug: "c1",
  type: "MCQ_SINGLE",
  difficulty: 1,
  points: 1,
  prompt: id,
  payload: {
    options: [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ],
  },
  solution: { correct: ["a"] },
  explanation: "",
  hint: null,
  source: null,
  concepts: [],
  ...over,
})

const right = { selected: ["a"] }
const wrong = { selected: ["b"] }
const store = () => useProgressStore.getState()

beforeEach(() => useProgressStore.setState(EMPTY_PROGRESS))

describe("submitAttempt", () => {
  it("records the attempt with the real correction", async () => {
    const result = await submitAttempt({
      exercise: mcq("e1"),
      submission: right,
    })
    expect(result.passed).toBe(true)
    expect(store().attempts).toMatchObject([
      { exerciseId: "e1", passed: true, source: "PRACTICE" },
    ])
  })

  it("schedules linked concepts on success only", async () => {
    const exercise = mcq("e1", { concepts: ["c"] })
    await submitAttempt({ exercise, submission: wrong })
    expect(store().mastery.c).toBeUndefined()

    await submitAttempt({ exercise, submission: right })
    expect(store().mastery.c).toMatchObject({
      reps: 1,
      interval: 1,
      lastGrade: 5,
    })
  })
})

describe("gate", () => {
  async function runGate(answers: object[]) {
    const runId = startGateRun("m1", ["a", "b"])
    for (const [i, submission] of answers.entries()) {
      await submitAttempt({
        exercise: mcq(`e${i}`),
        submission: submission as never,
        source: "GATE",
        runId,
      })
    }
    submitGateRun(runId, 0.8)
    return store().gateRuns.find((r) => r.id === runId)!
  }

  it("passes at exactly the threshold", async () => {
    const run = await runGate([right, right, right, right, wrong])
    expect(run.score).toBeCloseTo(0.8)
    expect(run.passed).toBe(true)
  })

  it("fails below the threshold", async () => {
    expect((await runGate([right, wrong])).passed).toBe(false)
  })

  it("does not let a finished run be scored again", async () => {
    const run = await runGate([wrong])
    useProgressStore.setState((s) => ({
      attempts: s.attempts.map((a) => ({ ...a, score: 1 })),
    }))
    submitGateRun(run.id, 0.8)
    expect(store().gateRuns.find((r) => r.id === run.id)?.score).toBe(0)
  })
})

describe("exam", () => {
  it("weights the score by points and counts unanswered questions as zero", async () => {
    const exercises = [mcq("a", { points: 3 }), mcq("b", { points: 1 })]
    const runId = startExamRun("partiel")
    await submitAttempt({
      exercise: exercises[0],
      submission: right,
      source: "EXAM",
      runId,
    })
    submitExamRun(runId, exercises)

    const run = store().examRuns[0]
    expect(run.score).toBeCloseTo(0.75)
    expect(run.noteSur20).toBeCloseTo(15)
  })
})

describe("attempt history", () => {
  it("keeps the student's answer for gates only", async () => {
    const exercise = mcq("g")
    await submitAttempt({ exercise, submission: right, source: "GATE", runId: "r" })
    await submitAttempt({ exercise, submission: right })
    const [gate, practice] = store().attempts.slice(-2)
    expect(gate.submission).toEqual(right)
    expect(practice.submission).toBeUndefined()
  })
})

describe("gate draw", () => {
  const pool = Array.from({ length: 30 }, (_, i) => `q${i}`)
  const drawn = () => {
    const id = startGateRun("m1", pool)
    return store().gateRuns.find((r) => r.id === id)!.exerciseIds!
  }

  it("draws 15 different questions from the pool", () => {
    const ids = drawn()
    expect(new Set(ids).size).toBe(15)
    expect(ids.every((id) => pool.includes(id))).toBe(true)
  })

  it("does not draw the same questions each time", () => {
    expect(drawn()).not.toEqual(drawn())
  })
})

describe("gradeConcept", () => {
  it("follows the SM-2 intervals", () => {
    gradeConcept("c", 5)
    expect(store().mastery.c).toMatchObject({ reps: 1, interval: 1 })
    gradeConcept("c", 5)
    expect(store().mastery.c).toMatchObject({ reps: 2, interval: 6 })
    gradeConcept("c", 5)
    expect(store().mastery.c).toMatchObject({ reps: 3, interval: 16 })
  })

  it("restarts after a failed recall and keeps ease above its floor", () => {
    for (let i = 0; i < 12; i++) gradeConcept("c", 0)
    expect(store().mastery.c).toMatchObject({ reps: 0, interval: 1, ease: 1.3 })
  })
})

describe("persistence", () => {
  it("writes progress to the browser and restores it", async () => {
    markSectionRead("c1/s")
    expect(localStorage.getItem(PROGRESS_KEY)).toContain("c1/s")

    useProgressStore.setState({ sectionsRead: {} }, false)
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        state: { ...EMPTY_PROGRESS, sectionsRead: { x: "t" } },
        version: 1,
      })
    )
    await useProgressStore.persist.rehydrate()
    expect(store().sectionsRead).toEqual({ x: "t" })
    expect(store().hydrated).toBe(true)
  })

  it("resets everything", async () => {
    markSectionRead("c1/s")
    await submitAttempt({
      exercise: mcq("e1", { concepts: ["c"] }),
      submission: right,
    })
    resetAllProgress()
    expect(store()).toMatchObject(EMPTY_PROGRESS)
  })
})

describe("skip", () => {
  const mod = {
    slug: "m1",
    chapters: [{ sectionIds: ["c1/s"], exerciseIds: ["e1", "e2"] }],
  }

  it("validates a skipped exercise without touching concept mastery", () => {
    skipExercise("e1")
    expect(store().attempts).toMatchObject([
      { exerciseId: "e1", passed: true, source: "SKIP" },
    ])
    expect(store().mastery).toEqual({})
  })

  it("validates the theory, the exercises and the gate of a skipped module", () => {
    skipModule(mod)
    expect(Object.keys(store().sectionsRead)).toEqual(["c1/s"])
    expect(store().attempts.map((a) => a.exerciseId)).toEqual(["e1", "e2"])
    expect(store().attempts.every((a) => a.source === "SKIP")).toBe(true)
    expect(store().gateRuns).toMatchObject([
      { moduleSlug: "m1", passed: true, score: null },
    ])
    expect(store().gateRuns[0].endedAt).not.toBeNull()
  })

  it("keeps the date of a section already read", () => {
    useProgressStore.setState({ sectionsRead: { "c1/s": "avant" } })
    skipModule(mod)
    expect(store().sectionsRead["c1/s"]).toBe("avant")
  })
})
