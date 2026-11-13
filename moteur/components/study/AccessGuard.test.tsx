import { act, cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { AccessGuard } from "@/components/study/AccessGuard"
import { ProgressHydrator } from "@/components/use-progress"
import { EMPTY_PROGRESS, useProgressStore } from "@/lib/store"

const { replace, course } = vi.hoisted(() => {
  const mod = (slug: string, order: number, chapterSlugs: string[]) => ({
    slug,
    order,
    title: slug,
    subtitle: null,
    description: "",
    chapters: chapterSlugs.map((c, i) => ({
      slug: c,
      order: i + 1,
      title: c,
      sectionIds: [`${c}/s`],
      exerciseIds: [],
    })),
  })
  return {
    replace: vi.fn(),
    course: {
      conceptCount: 0,
      exams: [],
      modules: [mod("m1", 1, ["c1", "c2"]), mod("m2", 2, ["c3"])],
    },
  }
})

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }))
vi.mock("@/lib/generated/course-index.json", () => ({ default: course }))

type GuardProps = Partial<React.ComponentProps<typeof AccessGuard>>

const guard = (props: GuardProps) => (
  <>
    <ProgressHydrator />
    <AccessGuard moduleSlug="m1" {...props}>
      <p>contenu</p>
    </AccessGuard>
  </>
)

async function renderHydrated(props: GuardProps) {
  await act(async () => {
    render(guard(props))
  })
}

beforeEach(() => {
  replace.mockClear()
  useProgressStore.setState({ ...EMPTY_PROGRESS, hydrated: false })
})
afterEach(cleanup)

describe("AccessGuard", () => {
  it("does not redirect before stored progress is loaded", () => {
    const rehydrate = vi
      .spyOn(useProgressStore.persist, "rehydrate")
      .mockResolvedValue()
    render(guard({ moduleSlug: "m2" }))
    expect(screen.getByText("contenu")).toBeDefined()
    expect(replace).not.toHaveBeenCalled()
    rehydrate.mockRestore()
  })

  it("lets an unlocked page through", async () => {
    await renderHydrated({ chapterSlug: "c1" })
    expect(screen.getByText("contenu")).toBeDefined()
    expect(replace).not.toHaveBeenCalled()
  })

  it("redirects a locked module to the module list", async () => {
    await renderHydrated({ moduleSlug: "m2" })
    expect(screen.queryByText("contenu")).toBeNull()
    expect(replace).toHaveBeenCalledWith("/modules")
  })

  it("redirects a locked chapter to its module", async () => {
    await renderHydrated({ chapterSlug: "c2" })
    expect(replace).toHaveBeenCalledWith("/modules/m1")
  })

  it("keeps the gate closed until every chapter is complete", async () => {
    await renderHydrated({ requireChapters: true })
    expect(replace).toHaveBeenCalledWith("/modules/m1")
  })

  it("opens a chapter once the previous one is read", async () => {
    useProgressStore.setState({ sectionsRead: { "c1/s": "x" } })
    await renderHydrated({ chapterSlug: "c2" })
    expect(screen.getByText("contenu")).toBeDefined()
    expect(replace).not.toHaveBeenCalled()
  })
})
