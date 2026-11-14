// @vitest-environment node
import fs from "node:fs"
import { describe, expect, it } from "vitest"
import { GATE_SIZE } from "@/lib/course"
import { readingMinutes } from "@/lib/mdx-meta"
import {
  exerciseId,
  getCatalog,
  getCourseIndex,
  getGatePool,
} from "@/lib/catalog"

describe("catalog", () => {
  const { modules, exams } = getCatalog()
  const chapters = modules.flatMap((m) => m.chapters)

  it("derives exercise ids from the prompt so progress survives rebuilds", () => {
    expect(exerciseId("c", "énoncé")).toBe(exerciseId("c", "énoncé"))
    expect(exerciseId("c", "énoncé")).not.toBe(exerciseId("d", "énoncé"))
    expect(exerciseId("c", "énoncé")).not.toBe(exerciseId("c", "autre"))
  })

  it("keeps chapter slugs unique across modules", () => {
    expect(new Set(chapters.map((c) => c.slug)).size).toBe(chapters.length)
  })

  it("places exam questions in their chapter, after the regular exercises", () => {
    const question = exams[0].exercises[0]
    const list = chapters.find(
      (c) => c.slug === question.chapterSlug
    )!.exercises
    const regular = JSON.parse(
      fs.readFileSync(
        `content/exercises/${modules.find((m) => m.chapters.some((c) => c.slug === question.chapterSlug))!.slug}.json`,
        "utf8"
      )
    ) as { chapterSlug: string }[]
    const regularCount = regular.filter(
      (e) => e.chapterSlug === question.chapterSlug
    ).length
    expect(list.findIndex((e) => e.id === question.id)).toBeGreaterThanOrEqual(
      regularCount
    )
  })

  it("never puts a self-graded writing exercise in a gate", () => {
    for (const mod of modules) {
      expect(getGatePool(mod).some((e) => e.type === "WRITING")).toBe(false)
    }
  })

  it("offers each gate more questions than it draws, all from the module", () => {
    for (const mod of modules) {
      const ids = new Set(
        mod.chapters.flatMap((c) => c.exercises.map((e) => e.id))
      )
      expect(mod.gatePoolIds.length).toBeGreaterThan(GATE_SIZE)
      expect(mod.gatePoolIds.every((id) => ids.has(id))).toBe(true)
    }
  })

  it("derives reading time from the section text", () => {
    const section = modules[0].chapters[0].sections[0]
    expect(section.estimatedReadMin).toBe(
      readingMinutes(fs.readFileSync(`content/${section.mdxPath}`, "utf8"))
    )
  })

  it("exposes an index without any exercise content", () => {
    const index = JSON.stringify(getCourseIndex())
    expect(index).not.toContain("solution")
    expect(index).not.toContain("explanation")
  })
})
