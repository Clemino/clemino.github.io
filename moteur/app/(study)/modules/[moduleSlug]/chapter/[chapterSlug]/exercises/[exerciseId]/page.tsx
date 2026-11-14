import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { ExerciseShell } from "@/components/exercise/ExerciseShell"
import { AccessGuard } from "@/components/study/AccessGuard"
import { getAllChapters, getChapter } from "@/lib/catalog"

export function generateStaticParams() {
  return getAllChapters().flatMap(({ moduleSlug, chapter }) =>
    chapter.exercises.map((e) => ({
      moduleSlug,
      chapterSlug: chapter.slug,
      exerciseId: e.id,
    }))
  )
}

export default async function ExercisePage(props: {
  params: Promise<{
    moduleSlug: string
    chapterSlug: string
    exerciseId: string
  }>
}) {
  const { moduleSlug, chapterSlug, exerciseId } = await props.params
  const chapter = getChapter(moduleSlug, chapterSlug)
  if (!chapter) notFound()

  const idx = chapter.exercises.findIndex((e) => e.id === exerciseId)
  if (idx === -1) notFound()
  const exercise = chapter.exercises[idx]
  const next =
    idx < chapter.exercises.length - 1 ? chapter.exercises[idx + 1] : null

  return (
    <AccessGuard moduleSlug={moduleSlug} chapterSlug={chapterSlug}>
      <div className="mx-auto max-w-4xl px-8 py-12">
        <Link
          href={`/modules/${moduleSlug}/chapter/${chapterSlug}`}
          className="mono-label hover:text-[var(--fg-0)]"
        >
          <ArrowLeftIcon className="inline size-3" /> {chapter.title}
        </Link>

        <div className="mt-3 mb-8 flex items-baseline justify-between border-b border-[var(--border)] pb-3">
          <span className="font-mono text-[10px] tracking-widest text-[var(--fg-3)] uppercase">
            Exercice {idx + 1} / {chapter.exercises.length}
          </span>
        </div>

        <ExerciseShell
          exercise={exercise}
          nextExerciseId={next?.id ?? null}
          courseHref={
            // A chapter can have exercises before its theory is written.
            chapter.sections[0]
              ? `/modules/${moduleSlug}/chapter/${chapterSlug}/theory/${chapter.sections[0].slug}?exercice=${exercise.id}`
              : `/modules/${moduleSlug}/chapter/${chapterSlug}`
          }
        />
      </div>
    </AccessGuard>
  )
}
