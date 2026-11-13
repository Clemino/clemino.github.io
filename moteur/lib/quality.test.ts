// @vitest-environment node
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { describe, expect, it } from "vitest"
import {
  measureQuality,
  qualityErrors,
  readCourse,
  type CourseFiles,
  type RawExercise,
} from "@/lib/quality"

let count = 0
function exercise(
  type: RawExercise["type"],
  payload: unknown,
  solution: unknown,
  chapterSlug = "c1"
): RawExercise {
  count++
  return {
    chapterSlug,
    type,
    prompt: `Question ${count}`,
    payload,
    solution,
    hint: "Rappel",
    source: "CM, p. 1",
    concepts: ["k1"],
  }
}
const mcq = (correctIsLongest: boolean, chapterSlug?: string) =>
  exercise(
    "MCQ_SINGLE",
    {
      options: [
        {
          id: "a",
          label: correctIsLongest ? "la plus longue de toutes" : "oui",
        },
        { id: "b", label: "moyenne" },
        { id: "c", label: "aussi" },
      ],
    },
    { correct: ["a"] },
    chapterSlug
  )
const trueFalse = (value: boolean, chapterSlug?: string) =>
  exercise("TRUE_FALSE", {}, { value }, chapterSlug)
const matching = (chapterSlug?: string) =>
  exercise(
    "MATCHING",
    { left: [{ id: "l", label: "L" }], right: [{ id: "r", label: "R" }] },
    { pairs: { l: "r" } },
    chapterSlug
  )
const ordering = (chapterSlug?: string) =>
  exercise(
    "ORDERING",
    {
      items: [
        { id: "x", label: "X" },
        { id: "y", label: "Y" },
      ],
    },
    { order: ["x", "y"] },
    chapterSlug
  )

/** 15 auto-graded exercises of 4 types, 1 QCM in 4 with the longest answer, 2 « vrai » in 4. */
const practice = (chapterSlug?: string) => [
  mcq(true, chapterSlug),
  mcq(false, chapterSlug),
  mcq(false, chapterSlug),
  mcq(false, chapterSlug),
  trueFalse(true, chapterSlug),
  trueFalse(true, chapterSlug),
  trueFalse(false, chapterSlug),
  trueFalse(false, chapterSlug),
  matching(chapterSlug),
  matching(chapterSlug),
  matching(chapterSlug),
  matching(chapterSlug),
  ordering(chapterSlug),
  ordering(chapterSlug),
  ordering(chapterSlug),
]

function goodCourse(): CourseFiles {
  return {
    modules: [{ slug: "m1", chapters: [{ slug: "c1", sections: ["01-a"] }] }],
    sections: [
      {
        moduleSlug: "m1",
        chapterSlug: "c1",
        file: "01-a",
        written: true,
        source: "CM, p. 1",
        concepts: ["k1"],
      },
    ],
    concepts: [{ slug: "k1", summary: "Résumé" }],
    exercises: practice(),
    exams: [{ slug: "final", exercises: [mcq(false)] }],
  }
}

/** Adds a module whose single chapter has a written section. */
function addModule(course: CourseFiles, slug: string, chapterSlug: string) {
  course.modules.push({
    slug,
    chapters: [{ slug: chapterSlug, sections: ["01-x"] }],
  })
  course.sections.push({
    moduleSlug: slug,
    chapterSlug,
    file: "01-x",
    written: true,
    source: "CM, p. 2",
    concepts: ["k1"],
  })
}

const errorsOf = (course: CourseFiles) => qualityErrors(measureQuality(course))
const anyError = (course: CourseFiles, ...words: string[]) =>
  errorsOf(course).some((e) => words.every((w) => e.includes(w)))

describe("qualityErrors", () => {
  it("accepts a course that meets every rule", () => {
    expect(errorsOf(goodCourse())).toEqual([])
  })

  it("asks for 15 auto-graded exercises per module", () => {
    const course = goodCourse()
    course.exercises.pop()
    expect(anyError(course, "m1", "15")).toBe(true)
  })

  it("asks for 4 types of auto-graded exercises per module", () => {
    const course = goodCourse()
    course.exercises = course.exercises.map((e) =>
      e.type === "ORDERING" ? matching() : e
    )
    expect(anyError(course, "types")).toBe(true)
  })

  it("rejects a chapter without exercise", () => {
    const course = goodCourse()
    course.modules[0].chapters.push({ slug: "c2", sections: ["02-b"] })
    course.sections.push({
      moduleSlug: "m1",
      chapterSlug: "c2",
      file: "02-b",
      written: true,
      source: "CM, p. 3",
      concepts: ["k1"],
    })
    expect(anyError(course, "c2")).toBe(true)
  })

  it("rejects a chapter without section", () => {
    const course = goodCourse()
    course.modules[0].chapters.push({ slug: "c3", sections: [] })
    course.exercises.push(matching("c3"))
    expect(anyError(course, "c3")).toBe(true)
  })

  it("rejects a planned section that is not written", () => {
    const course = goodCourse()
    course.sections[0] = {
      ...course.sections[0],
      written: false,
      source: null,
      concepts: [],
    }
    expect(anyError(course, "01-a")).toBe(true)
  })

  it("rejects QCM whose answer is too often the longest", () => {
    const course = goodCourse()
    course.exercises[1] = mcq(true)
    expect(anyError(course, "plus longue")).toBe(true)
  })

  it("rejects true or false questions that are almost all true", () => {
    const course = goodCourse()
    course.exercises = course.exercises.map((e) =>
      e.type === "TRUE_FALSE" ? trueFalse(true) : e
    )
    expect(anyError(course, "vrai")).toBe(true)
  })

  it("asks every exercise for its own hint", () => {
    const course = goodCourse()
    delete course.exercises[0].hint
    expect(anyError(course, "indice")).toBe(true)
  })

  it("asks every exercise for its source", () => {
    const course = goodCourse()
    delete course.exercises[0].source
    expect(anyError(course, "source")).toBe(true)
  })

  it("asks every section for its source", () => {
    const course = goodCourse()
    course.sections[0].source = null
    expect(anyError(course, "01-a", "source")).toBe(true)
  })

  it("asks every concept for a summary", () => {
    const course = goodCourse()
    course.concepts[0].summary = ""
    expect(anyError(course, "k1")).toBe(true)
  })

  it("rejects a concept used nowhere", () => {
    const course = goodCourse()
    course.concepts.push({ slug: "k2", summary: "Inutile" })
    expect(anyError(course, "k2")).toBe(true)
  })

  it("asks for an exam that covers every module", () => {
    const course = goodCourse()
    addModule(course, "m2", "d1")
    course.exercises.push(...practice("d1"))
    expect(anyError(course, "examen", "m2")).toBe(true)
  })

  it("reports a module without any exercise instead of failing", () => {
    const course = goodCourse()
    addModule(course, "m3", "e1")
    expect(anyError(course, "m3")).toBe(true)
  })
})

describe("readCourse", () => {
  it("returns a planned section without file as not written", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "quality-"))
    fs.writeFileSync(
      path.join(dir, "modules.ts"),
      'export const MODULES = [{ slug: "m1", chapters: [{ slug: "c1", sections: ["01-a", "02-b"] }] }]\n'
    )
    fs.mkdirSync(path.join(dir, "theory", "m1"), { recursive: true })
    fs.writeFileSync(
      path.join(dir, "theory", "m1", "01-a.mdx"),
      '---\ntitle: "A"\nsource: "CM, p. 1"\nconcepts: [k1]\n---\nTexte\n'
    )
    fs.writeFileSync(
      path.join(dir, "concepts.json"),
      '[{ "slug": "k1", "label": "K1", "summary": "Résumé" }]'
    )

    const course = await readCourse(dir)

    expect(course.sections).toEqual([
      {
        moduleSlug: "m1",
        chapterSlug: "c1",
        file: "01-a",
        written: true,
        source: "CM, p. 1",
        concepts: ["k1"],
      },
      {
        moduleSlug: "m1",
        chapterSlug: "c1",
        file: "02-b",
        written: false,
        source: null,
        concepts: [],
      },
    ])
    expect(measureQuality(course).missingSections).toEqual(["m1/02-b"])
  })
})

describe.each([
  {
    id: "admin",
    minAuto: 19,
    minTypes: 5,
    longest: [31, 141],
    vrai: [39, 88],
    missing: 2,
  },
  {
    id: "contrats",
    minAuto: 20,
    minTypes: 5,
    longest: [19, 77],
    vrai: [29, 64],
    missing: 3,
  },
])(
  "the measures of $id",
  ({ id, minAuto, minTypes, longest, vrai, missing }) => {
    it("match the reference figures of the design", async () => {
      const m = measureQuality(
        await readCourse(path.join(process.cwd(), "courses", id))
      )
      expect(Math.min(...Object.values(m.autoPerModule))).toBe(minAuto)
      expect(Math.min(...Object.values(m.typesPerModule))).toBe(minTypes)
      expect([m.mcqLongestCorrect, m.mcqSingle]).toEqual(longest)
      expect([m.trueFalseTrue, m.trueFalse]).toEqual(vrai)
      expect(m.bestExam.missingModules).toHaveLength(missing)
    })
  }
)
