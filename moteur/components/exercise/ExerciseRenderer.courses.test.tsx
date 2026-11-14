import fs from "node:fs"
import path from "node:path"
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { ExerciseRenderer } from "./ExerciseRenderer"

type Item = {
  type: string
  prompt: string
  payload: unknown
  solution: unknown
}

const root = path.join(process.cwd(), "courses")
const readJson = (file: string) => JSON.parse(fs.readFileSync(file, "utf8"))
const jsonFiles = (dir: string) =>
  fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f))

function exercisesOf(course: string): Item[] {
  return [
    ...jsonFiles(path.join(root, course, "exercises")).flatMap(
      (f) => readJson(f) as Item[]
    ),
    ...jsonFiles(path.join(root, course, "exam")).flatMap(
      (f) => readJson(f).exercises as Item[]
    ),
  ]
}

afterEach(cleanup)

describe.each(fs.readdirSync(root))("every exercise of %s", (course) => {
  it("renders without an unsupported type", () => {
    for (const ex of exercisesOf(course)) {
      const { container, unmount } = render(
        <ExerciseRenderer
          type={ex.type}
          payload={ex.payload}
          solution={ex.solution}
          submission={null}
          disabled={false}
          onChange={() => {}}
        />
      )
      expect(container.textContent, ex.prompt).not.toContain("non supporté")
      unmount()
    }
  }, 120000)
})
