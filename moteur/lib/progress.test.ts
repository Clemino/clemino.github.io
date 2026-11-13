import { describe, expect, it } from "vitest"
import type { ConceptInfo, CourseIndex } from "@/lib/course"
import { computeProgress, getDueConcepts, nextStepAfterChapter, type ModuleSummary } from "@/lib/progress"
import {
  EMPTY_PROGRESS,
  type Attempt,
  type GateRun,
  type ProgressData,
} from "@/lib/store"

const course: CourseIndex = {
  conceptCount: 2,
  exams: [],
  modules: [
    {
      slug: "m1",
      order: 1,
      title: "Un",
      subtitle: null,
      description: "",
      chapters: [
        {
          slug: "c1",
          order: 1,
          title: "",
          sectionIds: ["c1/s"],
          exerciseIds: ["e1"],
        },
        {
          slug: "c2",
          order: 2,
          title: "",
          sectionIds: [],
          exerciseIds: ["e2"],
        },
      ],
    },
    {
      slug: "m2",
      order: 2,
      title: "Deux",
      subtitle: null,
      description: "",
      chapters: [
        { slug: "c3", order: 1, title: "", sectionIds: [], exerciseIds: [] },
      ],
    },
  ],
}

const passed = (
  exerciseId: string,
  source: Attempt["source"] = "PRACTICE"
): Attempt => ({
  exerciseId,
  score: 1,
  passed: true,
  source,
  createdAt: "2026-01-01T00:00:00.000Z",
})

const gate = (over: Partial<GateRun>): GateRun => ({
  id: "g",
  moduleSlug: "m1",
  startedAt: "2026-01-01T00:00:00.000Z",
  endedAt: "2026-01-01T00:10:00.000Z",
  score: 0.5,
  passed: false,
  ...over,
})

const compute = (data: Partial<ProgressData>) =>
  computeProgress(course, { ...EMPTY_PROGRESS, ...data })

describe("computeProgress", () => {
  it("only opens the first module and the first chapter of each module at start", () => {
    const { modules, chapters } = compute({})
    expect(modules.map((m) => m.unlocked)).toEqual([true, false])
    expect(chapters.c1.unlocked).toBe(true)
    expect(chapters.c2.unlocked).toBe(false)
    expect(chapters.c3.unlocked).toBe(true)
  })

  it("needs both the theory and the exercises to complete a chapter", () => {
    expect(compute({ attempts: [passed("e1")] }).chapters.c1.completed).toBe(
      false
    )
    expect(
      compute({ sectionsRead: { "c1/s": "x" } }).chapters.c1.completed
    ).toBe(false)

    const { chapters } = compute({
      attempts: [passed("e1")],
      sectionsRead: { "c1/s": "x" },
    })
    expect(chapters.c1.completed).toBe(true)
    expect(chapters.c2.unlocked).toBe(true)
  })

  it("counts only practice attempts as passed exercises", () => {
    const { passedExercises, modules } = compute({
      attempts: [passed("e1", "GATE"), passed("e2", "REVIEW")],
    })
    expect(passedExercises.size).toBe(0)
    expect(modules[0].exercisesDone).toBe(0)
  })

  it("counts a skipped exercise as passed", () => {
    const { passedExercises, chapters } = compute({
      attempts: [passed("e1", "SKIP")],
      sectionsRead: { "c1/s": "x" },
    })
    expect(passedExercises.has("e1")).toBe(true)
    expect(chapters.c1.completed).toBe(true)
  })

  it("unlocks the next module after a skipped gate without inventing a score", () => {
    const { modules } = compute({
      gateRuns: [gate({ score: null, passed: true })],
    })
    expect(modules[0].completed).toBe(true)
    expect(modules[1].unlocked).toBe(true)
    expect(modules[0].bestGateScore).toBeNull()
  })

  it("does not let an unwritten chapter lock the one after it", () => {
    const withGap: CourseIndex = {
      ...course,
      modules: [
        {
          ...course.modules[0],
          chapters: [
            { slug: "empty", order: 1, title: "", sectionIds: [], exerciseIds: [] },
            { slug: "written", order: 2, title: "", sectionIds: [], exerciseIds: ["e1"] },
            { slug: "after", order: 3, title: "", sectionIds: [], exerciseIds: ["e2"] },
          ],
        },
      ],
    }
    const { chapters } = computeProgress(withGap, EMPTY_PROGRESS)
    expect(chapters.empty.completed).toBe(false)
    expect(chapters.written.unlocked).toBe(true)
    expect(chapters.after.unlocked).toBe(false)
  })

  it("never completes an empty chapter", () => {
    const { chapters, modules } = compute({})
    expect(chapters.c3.completed).toBe(false)
    expect(modules[1].chaptersComplete).toBe(false)
  })

  it("unlocks the next module only once the gate is passed, and keeps the best score", () => {
    const failed = compute({ gateRuns: [gate({ id: "a", score: 0.5 })] })
    expect(failed.modules[1].unlocked).toBe(false)
    expect(failed.modules[0].bestGateScore).toBe(0.5)

    const { modules } = compute({
      gateRuns: [
        gate({ id: "a", score: 0.9, passed: true }),
        gate({ id: "b", score: 0.6 }),
      ],
    })
    expect(modules[0].completed).toBe(true)
    expect(modules[1].unlocked).toBe(true)
    expect(modules[0].bestGateScore).toBe(0.9)
  })

  it("ignores a gate still in progress", () => {
    const { modules } = compute({
      gateRuns: [gate({ endedAt: null, score: null, passed: null })],
    })
    expect(modules[0].bestGateScore).toBeNull()
  })
})

describe("getDueConcepts", () => {
  const concept = (slug: string): ConceptInfo => ({
    slug,
    label: slug,
    summary: null,
    sectionCount: 0,
    exerciseCount: 0,
  })
  const now = new Date("2026-06-01T00:00:00.000Z").getTime()
  const mastery = (reps: number, dueAt: string) => ({
    ease: 2.5,
    interval: 1,
    reps,
    dueAt,
    lastGrade: 5,
  })

  it("treats a concept never seen as due", () => {
    expect(getDueConcepts([concept("a")], {}, now)).toHaveLength(1)
  })

  it("leaves out concepts scheduled later and sorts the least practiced first", () => {
    const due = getDueConcepts(
      [concept("later"), concept("twice"), concept("once")],
      {
        later: mastery(0, "2026-07-01T00:00:00.000Z"),
        twice: mastery(2, "2026-05-01T00:00:00.000Z"),
        once: mastery(1, "2026-05-20T00:00:00.000Z"),
      },
      now
    )
    expect(due.map((d) => d.concept.slug)).toEqual(["once", "twice"])
  })

  it("respects the limit", () => {
    expect(
      getDueConcepts([concept("a"), concept("b")], {}, now, 1)
    ).toHaveLength(1)
  })
})

describe("nextStepAfterChapter", () => {
  const mod = {
    slug: "m1",
    chapters: [
      { slug: "c1", order: 1 },
      { slug: "c2", order: 2 },
    ],
  } as unknown as ModuleSummary

  it("leads to the next chapter", () => {
    expect(nextStepAfterChapter(mod, "c1")).toEqual({ href: "/modules/m1/chapter/c2", label: "Chapitre suivant" })
  })

  it("leads to the gate after the last chapter", () => {
    expect(nextStepAfterChapter(mod, "c2").href).toBe("/modules/m1/gate")
  })
})
