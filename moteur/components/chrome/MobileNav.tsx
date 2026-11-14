"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3Icon,
  BookOpenIcon,
  BrainIcon,
  HomeIcon,
  LibraryBigIcon,
  MenuIcon,
  SettingsIcon,
  TrophyIcon,
} from "lucide-react"
import { AccountButton } from "@/components/chrome/AccountButton"
import { ThemeToggle } from "@/components/chrome/ThemeToggle"
import { ModuleList } from "@/components/study/ModuleList"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { COURSE } from "@/content/course"
import { cn } from "@/lib/utils"

const PAGES = [
  { href: "/", label: "Accueil", icon: HomeIcon },
  { href: "/modules", label: "Modules", icon: BookOpenIcon },
  { href: "/review", label: "Révision", icon: BrainIcon },
  { href: "/exam", label: "Examens blancs", icon: TrophyIcon },
  { href: "/stats", label: "Stats", icon: BarChart3Icon },
  { href: "/settings", label: "Réglages", icon: SettingsIcon },
]

const itemClass =
  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors"

function CourseName() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-fg)]">
        <COURSE.icon className="size-4" strokeWidth={2.5} />
      </span>
      <span className="font-mono text-sm tracking-tight">
        <span className="font-semibold">{COURSE.id}</span>
        <span className="text-[var(--fg-2)]">.app</span>
      </span>
    </span>
  )
}

/** Top bar and menu below the md breakpoint, where the sidebar and the home navigation are hidden. */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  // The static export adds a trailing slash to every page but the root.
  const path = usePathname().replace(/(.)\/$/, "$1")
  // Timed runs have their own header, and must not be left by mistake.
  if (path.endsWith("/run")) return null

  const isCurrent = (href: string) =>
    href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-0)]/85 px-4 py-2.5 backdrop-blur md:hidden">
      <Link href="/">
        <CourseName />
      </Link>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[85vw] gap-0 overflow-y-auto bg-[var(--bg-1)] p-0"
        >
          <SheetHeader className="border-b border-[var(--border)] px-4 py-3">
            <SheetTitle>
              <CourseName />
            </SheetTitle>
            <SheetDescription className="sr-only">
              Pages et modules du cours
            </SheetDescription>
          </SheetHeader>

          <nav aria-label="Pages du cours" className="px-2 py-3">
            <ul className="space-y-0.5">
              {PAGES.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    aria-current={isCurrent(href) ? "page" : undefined}
                    className={cn(
                      itemClass,
                      isCurrent(href)
                        ? "bg-[var(--bg-2)] text-[var(--fg-0)]"
                        : "text-[var(--fg-1)] hover:bg-[var(--bg-2)]/60"
                    )}
                  >
                    <Icon className="size-4 text-[var(--fg-2)]" />
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                {/* The library lives outside this course's basePath, so next/link cannot reach it. */}
                <a
                  href="/cours/"
                  className={cn(
                    itemClass,
                    "text-[var(--fg-1)] hover:bg-[var(--bg-2)]/60"
                  )}
                >
                  <LibraryBigIcon className="size-4 text-[var(--fg-2)]" />
                  Mes cours
                </a>
              </li>
            </ul>
          </nav>

          <div className="border-t border-[var(--border)] px-2 py-3">
            <div className="mb-2 px-2 font-mono text-[10px] tracking-widest text-[var(--fg-3)] uppercase">
              Parcours
            </div>
            <ModuleList
              activeSlug={path.match(/^\/modules\/([^/]+)/)?.[1]}
              onNavigate={close}
            />
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] px-3 py-2">
            <AccountButton />
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
