"use client"

import Link from "next/link"
import { ArrowRightIcon, BookOpenIcon, CheckIcon, CircleIcon, FileTextIcon } from "lucide-react"
import { useProgress } from "@/components/use-progress"
import { Badge } from "@/components/ui/badge"
import { NextStepButton } from "@/components/study/NextStepButton"
import { EXERCISE_LABELS } from "@/lib/course"
import type { ExerciseType } from "@/lib/validators/types"

export type ChapterViewProps = {
  moduleSlug: string
  mod: { order: number; title: string }
  chapter: {
    slug: string
    order: number
    title: string
    sections: { id: string; slug: string; title: string; estimatedReadMin: number }[]
    exercises: { id: string; type: ExerciseType; difficulty: number }[]
  }
}

export function ChapterView({ moduleSlug, mod, chapter }: ChapterViewProps) {
  const { data, passedExercises } = useProgress()
  const chapterSlug = chapter.slug

  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <Link href={`/modules/${moduleSlug}`} className="mono-label hover:text-[var(--fg-0)]">
        ← {mod.title}
      </Link>

      <div className="mt-3 border-b border-[var(--border)] pb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs tabular-nums text-[var(--fg-3)]">
            {String(mod.order).padStart(2, "0")}.{String(chapter.order).padStart(2, "0")}
          </span>
        </div>
        <h1 className="mt-1 font-mono text-3xl tracking-tight">{chapter.title}</h1>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-baseline gap-2">
          <BookOpenIcon className="size-4 text-[var(--fg-2)]" />
          <h2 className="font-mono text-sm tracking-widest uppercase text-[var(--fg-2)]">
            Théorie
          </h2>
        </div>
        <ol className="space-y-2">
          {chapter.sections.map((s) => {
            const read = s.id in data.sectionsRead
            return (
              <li key={s.id}>
                <Link
                  href={`/modules/${moduleSlug}/chapter/${chapterSlug}/theory/${s.slug}`}
                  className="group flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-4 py-3 transition-colors hover:bg-[var(--bg-2)]"
                >
                  {read ? (
                    <div className="flex size-4 items-center justify-center rounded-full bg-[var(--accent)]">
                      <CheckIcon className="size-2.5 text-[var(--accent-fg)]" strokeWidth={3} />
                    </div>
                  ) : (
                    <CircleIcon className="size-4 text-[var(--fg-3)]" />
                  )}
                  <span className="flex-1 text-sm">{s.title}</span>
                  <span className="font-mono text-xs text-[var(--fg-3)]">
                    ~{s.estimatedReadMin} min
                  </span>
                  <ArrowRightIcon className="size-4 text-[var(--fg-3)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-baseline gap-2">
          <FileTextIcon className="size-4 text-[var(--fg-2)]" />
          <h2 className="font-mono text-sm tracking-widest uppercase text-[var(--fg-2)]">
            Exercices
          </h2>
          <span className="ml-auto font-mono text-xs text-[var(--fg-2)] tabular-nums">
            {chapter.exercises.filter((e) => passedExercises.has(e.id)).length} /{" "}
            {chapter.exercises.length}
          </span>
        </div>
        <ol className="grid gap-2 md:grid-cols-2">
          {chapter.exercises.map((e, i) => {
            const passed = passedExercises.has(e.id)
            return (
              <li key={e.id}>
                <Link
                  href={`/modules/${moduleSlug}/chapter/${chapterSlug}/exercises/${e.id}`}
                  className="group flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-3 py-2 transition-colors hover:bg-[var(--bg-2)]"
                >
                  {passed ? (
                    <div className="flex size-4 items-center justify-center rounded-full bg-[var(--accent)]">
                      <CheckIcon className="size-2.5 text-[var(--accent-fg)]" strokeWidth={3} />
                    </div>
                  ) : (
                    <CircleIcon className="size-4 text-[var(--fg-3)]" />
                  )}
                  <span className="font-mono text-xs tabular-nums text-[var(--fg-2)]">
                    Q{String(i + 1).padStart(2, "0")}
                  </span>
                  <Badge variant="outline" className="border-[var(--border)] font-mono text-[9px] text-[var(--fg-2)]">
                    {EXERCISE_LABELS[e.type]}
                  </Badge>
                  <span className="ml-auto font-mono text-[10px] text-[var(--fg-3)]">
                    ★{e.difficulty}
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      <NextStepButton moduleSlug={moduleSlug} chapterSlug={chapterSlug} />
    </div>
  )
}
