// @vitest-environment node
import { describe, expect, it } from "vitest"
import { parseFrontmatter, readingMinutes } from "@/lib/mdx-meta"

const words = (n: number) => Array.from({ length: n }, () => "mot").join(" ")
const frontmatter = '---\ntitle: "T"\nsource: "CM, p. 1"\n---\n'

describe("readingMinutes", () => {
  it("counts 200 words a minute, rounded", () => {
    expect(readingMinutes(frontmatter + words(400))).toBe(2)
    expect(readingMinutes(frontmatter + words(500))).toBe(3)
  })

  it("never announces less than a minute", () => {
    expect(readingMinutes(frontmatter + words(3))).toBe(1)
    expect(readingMinutes(frontmatter)).toBe(1)
  })

  // 250 words read in 1 minute; counting the 100 words of the source would make it 2.
  const longFrontmatter = `---\ntitle: "T"\nsource: "${words(100)}"\n---\n`

  it("ignores the frontmatter", () => {
    expect(readingMinutes(longFrontmatter + words(250))).toBe(1)
  })

  it("ignores the frontmatter with Windows line endings", () => {
    expect(
      readingMinutes(longFrontmatter.replaceAll("\n", "\r\n") + words(250))
    ).toBe(1)
  })

  it("does not count table markup as words", () => {
    expect(
      readingMinutes(frontmatter + "| --- |\n".repeat(100) + words(200))
    ).toBe(1)
  })
})

describe("parseFrontmatter", () => {
  it("reads the metadata of a section", () => {
    expect(parseFrontmatter(frontmatter + "x")).toEqual({
      title: "T",
      source: "CM, p. 1",
    })
  })
})
