import { beforeEach, describe, expect, it, vi } from "vitest"
import { canOpenCourse } from "./access"

const db = vi.hoisted(() => ({
  session: null as unknown,
  row: null as unknown,
  error: null as unknown,
}))

vi.mock("@/content/course", () => ({ COURSE: { id: "admin" } }))
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { getSession: async () => ({ data: { session: db.session } }) },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: db.row, error: db.error }),
        }),
      }),
    }),
  },
}))

describe("canOpenCourse", () => {
  beforeEach(() => {
    db.session = { user: { id: "u" } }
    db.row = null
    db.error = null
  })

  it("refuses a visitor who is not signed in", async () => {
    db.session = null
    expect(await canOpenCourse()).toBe(false)
  })

  it("refuses someone who does not follow this course", async () => {
    expect(await canOpenCourse()).toBe(false)
  })

  it("lets someone in who follows this course", async () => {
    db.row = { course: "admin" }
    expect(await canOpenCourse()).toBe(true)
  })

  it("does not lock someone out because of a network failure", async () => {
    db.error = { message: "offline" }
    expect(await canOpenCourse()).toBe(true)
  })
})
