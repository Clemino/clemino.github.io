import { notFound } from "next/navigation"
import { AccessGuard } from "@/components/study/AccessGuard"
import { ChapterView } from "@/components/study/ChapterView"
import { getAllChapters, getChapter, getModule } from "@/lib/catalog"

export function generateStaticParams() {
  return getAllChapters().map(({ moduleSlug, chapter }) => ({ moduleSlug, chapterSlug: chapter.slug }))
}

export default async function ChapterPage(props: {
  params: Promise<{ moduleSlug: string; chapterSlug: string }>
}) {
  const { moduleSlug, chapterSlug } = await props.params
  const mod = getModule(moduleSlug)
  const chapter = getChapter(moduleSlug, chapterSlug)
  if (!mod || !chapter) notFound()

  return (
    <AccessGuard moduleSlug={moduleSlug} chapterSlug={chapterSlug}>
      <ChapterView
        moduleSlug={moduleSlug}
        mod={{ order: mod.order, title: mod.title }}
        chapter={{
          slug: chapter.slug,
          order: chapter.order,
          title: chapter.title,
          sections: chapter.sections.map(({ id, slug, title, estimatedReadMin }) => ({ id, slug, title, estimatedReadMin })),
          exercises: chapter.exercises.map(({ id, type, difficulty }) => ({ id, type, difficulty })),
        }}
      />
    </AccessGuard>
  )
}
