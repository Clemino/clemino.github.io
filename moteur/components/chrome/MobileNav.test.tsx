import "@testing-library/jest-dom/vitest"
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { MobileNav } from "@/components/chrome/MobileNav"
import { ProgressHydrator } from "@/components/use-progress"
import { EMPTY_PROGRESS, useProgressStore } from "@/lib/store"

const { nav, course } = vi.hoisted(() => {
  const mod = (slug: string, order: number) => ({
    slug,
    order,
    title: `Module ${order}`,
    subtitle: null,
    description: "",
    chapters: [
      {
        slug: `${slug}-c`,
        order: 1,
        title: "Chapitre",
        sectionIds: [`${slug}-c/s`],
        exerciseIds: [],
      },
    ],
  })
  return {
    nav: { pathname: "/" },
    course: {
      conceptCount: 0,
      exams: [],
      modules: [mod("m1", 1), mod("m2", 2)],
    },
  }
})

vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }))
vi.mock("@/lib/generated/course-index.json", () => ({ default: course }))
vi.mock("@/components/chrome/AccountButton", () => ({
  AccountButton: () => <button type="button">Se déconnecter</button>,
}))

async function renderNav(pathname = "/") {
  nav.pathname = pathname
  await act(async () => {
    render(
      <>
        <ProgressHydrator />
        <MobileNav />
      </>
    )
  })
}

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }))
  return screen.getByRole("dialog")
}

beforeEach(() => {
  useProgressStore.setState({ ...EMPTY_PROGRESS, hydrated: false })
})
afterEach(cleanup)

describe("MobileNav", () => {
  it("links the course name to its home page", async () => {
    await renderNav("/modules/")
    expect(screen.getByRole("link", { name: /\.app/ })).toHaveAttribute(
      "href",
      "/"
    )
  })

  it("lists every page of the course, the library and the account", async () => {
    await renderNav()
    const menu = openMenu()
    for (const name of [
      "Accueil",
      "Modules",
      "Révision",
      "Examens blancs",
      "Stats",
      "Réglages",
    ]) {
      expect(within(menu).getByRole("link", { name })).toBeInTheDocument()
    }
    expect(
      within(menu).getByRole("link", { name: "Mes cours" })
    ).toHaveAttribute("href", "/cours/")
    expect(
      within(menu).getByRole("button", { name: "Se déconnecter" })
    ).toBeInTheDocument()
  })

  it("shows the modules of the course", async () => {
    await renderNav()
    const menu = openMenu()
    expect(within(menu).getByText("Module 1")).toBeInTheDocument()
    expect(within(menu).getByText("Module 2")).toBeInTheDocument()
  })

  it("marks the current page", async () => {
    await renderNav("/review/")
    const menu = openMenu()
    expect(
      within(menu).getByRole("link", { name: "Révision" })
    ).toHaveAttribute("aria-current", "page")
    expect(
      within(menu).getByRole("link", { name: "Accueil" })
    ).not.toHaveAttribute("aria-current")
  })

  it("closes the menu once a link is chosen", async () => {
    await renderNav()
    const menu = openMenu()
    fireEvent.click(within(menu).getByRole("link", { name: "Stats" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it.each(["/exam/examen-final/run/", "/modules/m1/gate/run/"])(
    "stays out of the way during a timed run (%s)",
    async (pathname) => {
      await renderNav(pathname)
      expect(
        screen.queryByRole("button", { name: "Ouvrir le menu" })
      ).not.toBeInTheDocument()
    }
  )
})
