"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
  FileTextIcon,
  FlagIcon,
  LockIcon,
} from "lucide-react"
import { SkipModuleButton } from "@/components/study/SkipModuleButton"
import { useProgress } from "@/components/use-progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ModuleView({ moduleSlug }: { moduleSlug: string }) {
  const mod = useProgress().modules.find((m) => m.slug === moduleSlug)
  if (!mod) return null

  const totalExercises = mod.exercisesTotal
  const passedExercises = mod.exercisesDone
  const allExercisesDone =
    passedExercises === totalExercises && totalExercises > 0

  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <Link href="/modules" className="mono-label hover:text-[var(--fg-0)]">
        ← parcours
      </Link>

      <div className="mt-3 flex items-baseline gap-4 border-b border-[var(--border)] pb-6">
        <span className="font-mono text-3xl text-[var(--fg-3)] tabular-nums">
          {String(mod.order).padStart(2, "0")}
        </span>
        <div>
          <h1 className="font-mono text-3xl tracking-tight">{mod.title}</h1>
          {mod.subtitle && (
            <p className="mt-1 text-sm text-[var(--fg-2)]">{mod.subtitle}</p>
          )}
        </div>
      </div>

      <p className="mt-6 text-base leading-relaxed text-[var(--fg-1)]">
        {mod.description}
      </p>

      <div className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-mono text-sm tracking-widest text-[var(--fg-2)] uppercase">
            Chapitres
          </h2>
          <div className="font-mono text-xs text-[var(--fg-2)] tabular-nums">
            {passedExercises}/{totalExercises} exercices
          </div>
        </div>
        <ol className="space-y-3">
          {mod.chapters.map((c) => {
            const { sectionsRead, exercisesPassed } = c
            const chComplete =
              sectionsRead === c.sectionIds.length &&
              exercisesPassed === c.exerciseIds.length
            const locked = !c.unlocked
            const inner = (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--fg-3)] tabular-nums">
                      {String(mod.order).padStart(2, "0")}.
                      {String(c.order).padStart(2, "0")}
                    </span>
                    <h3 className="font-mono">{c.title}</h3>
                    {chComplete && (
                      <Badge
                        variant="outline"
                        className="border-[var(--accent-dim)] font-mono text-[10px] text-[var(--accent)]"
                      >
                        <CheckIcon className="size-2.5" /> done
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex gap-4 font-mono text-xs text-[var(--fg-2)]">
                    <span className="flex items-center gap-1">
                      <BookOpenIcon className="size-3" />
                      {sectionsRead}/{c.sectionIds.length} théorie
                    </span>
                    <span className="flex items-center gap-1">
                      <FileTextIcon className="size-3" />
                      {exercisesPassed}/{c.exerciseIds.length} exercices
                    </span>
                  </div>
                </div>
                {locked ? (
                  <LockIcon className="size-4 shrink-0 text-[var(--fg-3)]" />
                ) : (
                  <ArrowRightIcon className="size-4 shrink-0 text-[var(--fg-3)]" />
                )}
              </div>
            )
            return (
              <li key={c.slug} className="card-elevated">
                {locked ? (
                  <div className="block cursor-not-allowed px-5 py-4 opacity-60">
                    {inner}
                  </div>
                ) : (
                  <Link
                    href={`/modules/${moduleSlug}/chapter/${c.slug}`}
                    className="block px-5 py-4 transition-colors hover:bg-[var(--bg-2)]"
                  >
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      <div className="card-elevated mt-12 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-[var(--bg-3)]">
              {allExercisesDone ? (
                <FlagIcon className="size-4 text-[var(--accent)]" />
              ) : (
                <LockIcon className="size-4 text-[var(--fg-3)]" />
              )}
            </div>
            <div>
              <div className="font-mono text-sm">
                Quiz de validation du module
              </div>
              <p className="text-xs text-[var(--fg-2)]">
                {allExercisesDone
                  ? "Tous les exercices sont passés. Lance le gate (15 questions, seuil 80 %)."
                  : "Termine tous les exercices du module pour débloquer le gate."}
                {mod.bestGateScore != null && (
                  <span className="ml-2 text-[var(--accent)]">
                    meilleur score : {Math.round(mod.bestGateScore * 100)}%
                  </span>
                )}
              </p>
            </div>
          </div>
          <Button disabled={!allExercisesDone} asChild={allExercisesDone}>
            {allExercisesDone ? (
              <Link href={`/modules/${moduleSlug}/gate`}>
                Lancer le gate
                <ArrowRightIcon className="size-4" />
              </Link>
            ) : (
              <span>Verrouillé</span>
            )}
          </Button>
        </div>
      </div>

      <SkipModuleButton moduleSlug={moduleSlug} />
    </div>
  )
}
