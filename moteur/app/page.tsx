"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  LibraryBigIcon,
  LockIcon,
  TrophyIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AccountButton } from "@/components/chrome/AccountButton"
import { ThemeToggle } from "@/components/chrome/ThemeToggle"
import { useProgress } from "@/components/use-progress"
import { COURSE } from "@/content/course"

export default function HomePage() {
  const { modules } = useProgress()
  const totalExercises = modules.reduce((s, m) => s + m.exercisesTotal, 0)
  const doneExercises = modules.reduce((s, m) => s + m.exercisesDone, 0)
  const completedModules = modules.filter((m) => m.completed).length
  const currentModule =
    modules.find((m) => m.unlocked && !m.completed) ?? modules[0]

  return (
    <div className="relative min-h-svh overflow-hidden bg-[var(--bg-0)]">
      {/* Background grid + dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--fg-1) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <header className="relative border-b border-[var(--border)] bg-[var(--bg-0)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-fg)]">
              <COURSE.icon className="size-4" strokeWidth={2.5} />
            </div>
            <span className="font-mono text-sm tracking-tight">
              <span className="font-semibold">{COURSE.id}</span>
              <span className="text-[var(--fg-2)]">.app</span>
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              {/* The library lives outside this course's basePath, so next/link cannot reach it. */}
              <a href="/cours/">
                <LibraryBigIcon className="size-3.5" />
                Mes cours
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/modules">Modules</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/review">Révision</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/exam">Examens blancs</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/stats">Stats</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">Réglages</Link>
            </Button>
            <AccountButton />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 pt-20 pb-32">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-1)] px-3 py-1">
          <span className="size-1.5 rounded-full bg-[var(--accent)]" />
          <span className="mono-label">{COURSE.label}</span>
        </div>

        <h1 className="font-mono text-5xl tracking-tighter md:text-6xl">
          {COURSE.heading[0]}
          <br />
          <span className="text-[var(--accent)]">{COURSE.heading[1]}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--fg-1)]">
          {COURSE.intro} Objectif :{" "}
          <span className="text-[var(--fg-0)]">20/20</span>.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button size="lg" asChild>
            <Link href={`/modules/${currentModule.slug}`}>
              {doneExercises > 0 ? "Reprendre" : "Commencer"}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/modules">Voir tous les modules</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Modules"
            value={`${completedModules}/${modules.length}`}
            icon={<BookOpenIcon className="size-3.5" />}
          />
          <StatCard
            label="Exercices passés"
            value={`${doneExercises}/${totalExercises}`}
            icon={<CheckCircle2Icon className="size-3.5" />}
          />
          <StatCard
            label="Module courant"
            value={currentModule.title.split(" ").slice(0, 2).join(" ")}
            icon={<COURSE.icon className="size-3.5" />}
          />
          <StatCard
            label="Examens blancs"
            value={
              completedModules === modules.length ? "Débloqué" : "Verrouillé"
            }
            icon={
              completedModules === modules.length ? (
                <TrophyIcon className="size-3.5" />
              ) : (
                <LockIcon className="size-3.5" />
              )
            }
          />
        </div>

        {/* Module overview */}
        <div className="mt-20">
          <div className="mb-6 flex items-baseline justify-between border-b border-[var(--border)] pb-3">
            <h2 className="font-mono text-sm tracking-widest text-[var(--fg-2)] uppercase">
              Parcours
            </h2>
            <Link
              href="/modules"
              className="font-mono text-xs text-[var(--accent)] hover:underline"
            >
              tout voir →
            </Link>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {modules.map((m) => (
              <li key={m.slug}>
                <Link
                  href={m.unlocked ? `/modules/${m.slug}` : "/modules"}
                  className="group flex items-center justify-between gap-6 px-1 py-4 transition-colors hover:bg-[var(--bg-1)]"
                >
                  <div className="flex min-w-0 items-baseline gap-4">
                    <span className="font-mono text-xs text-[var(--fg-2)] tabular-nums">
                      {String(m.order).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{m.title}</div>
                      {m.subtitle && (
                        <div className="mt-0.5 truncate text-xs text-[var(--fg-2)]">
                          {m.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {m.completed && (
                      <Badge
                        variant="outline"
                        className="border-[var(--accent-dim)] font-mono text-[10px] text-[var(--accent)]"
                      >
                        passé
                      </Badge>
                    )}
                    {!m.unlocked && (
                      <LockIcon className="size-4 text-[var(--fg-3)]" />
                    )}
                    {m.unlocked && !m.completed && (
                      <span className="font-mono text-xs text-[var(--fg-2)]">
                        {m.exercisesDone}/{m.exercisesTotal}
                      </span>
                    )}
                    <ArrowRightIcon className="size-4 text-[var(--fg-3)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="relative border-t border-[var(--border)] py-6">
        <div className="mx-auto max-w-5xl px-6 font-mono text-xs text-[var(--fg-2)]">
          <span>{COURSE.id}.app</span>
          <span className="mx-2 text-[var(--fg-3)]">·</span>
          <span>
            Press{" "}
            <kbd className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-1.5 py-0.5">
              d
            </kbd>{" "}
            to toggle theme
          </span>
        </div>
      </footer>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="card-elevated p-4">
      <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-[var(--fg-2)] uppercase">
        {icon}
        {label}
      </div>
      <div className="mt-2 font-mono text-xl tabular-nums">{value}</div>
    </div>
  )
}
