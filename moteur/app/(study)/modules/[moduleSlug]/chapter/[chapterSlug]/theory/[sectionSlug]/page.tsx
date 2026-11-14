import fs from "node:fs"
import path from "node:path"
import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"
import { Button } from "@/components/ui/button"
import { AccessGuard } from "@/components/study/AccessGuard"
import { MarkReadButton } from "@/components/study/MarkReadButton"
import { mdxComponents } from "@/components/mdx/components"
import { getAllChapters, getChapter, getModule } from "@/lib/catalog"

export function generateStaticParams() {
  return getAllChapters().flatMap(({ moduleSlug, chapter }) =>
    chapter.sections.map((s) => ({
      moduleSlug,
      chapterSlug: chapter.slug,
      sectionSlug: s.slug,
    }))
  )
}

export default async function TheoryPage(props: {
  params: Promise<{
    moduleSlug: string
    chapterSlug: string
    sectionSlug: string
  }>
}) {
  const { moduleSlug, chapterSlug, sectionSlug } = await props.params
  const mod = getModule(moduleSlug)
  const chapter = getChapter(moduleSlug, chapterSlug)
  const section = chapter?.sections.find((s) => s.slug === sectionSlug)
  if (!mod || !chapter || !section) notFound()

  const raw = fs.readFileSync(
    path.join(process.cwd(), "content", section.mdxPath),
    "utf8"
  )
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")

  // Previous / next section
  const allSections = chapter.sections
  const idx = allSections.findIndex((s) => s.id === section.id)
  const prev = idx > 0 ? allSections[idx - 1] : null
  const next = idx < allSections.length - 1 ? allSections[idx + 1] : null

  return (
    <AccessGuard moduleSlug={moduleSlug} chapterSlug={chapterSlug}>
      <div className="mx-auto max-w-3xl px-8 py-12">
        <Link
          href={`/modules/${moduleSlug}/chapter/${chapterSlug}`}
          className="mono-label hover:text-[var(--fg-0)]"
        >
          ← {chapter.title}
        </Link>

        <div className="mt-3 mb-8 flex items-baseline justify-between border-b border-[var(--border)] pb-3">
          <span className="font-mono text-[10px] tracking-widest text-[var(--fg-3)] uppercase">
            {mod.title} · {chapter.title} · théorie {section.order}
          </span>
          <span className="font-mono text-[10px] text-[var(--fg-3)]">
            ~{section.estimatedReadMin} min
          </span>
        </div>

        <article className="prose-tad">
          <MDXRemote
            source={body}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  [
                    rehypePrettyCode,
                    {
                      theme: { dark: "github-dark", light: "github-light" },
                      keepBackground: false,
                    },
                  ],
                ],
              },
            }}
          />
        </article>

        {section.source && (
          <p className="mono-label mt-10">Source : {section.source}</p>
        )}

        <div className="mt-12 flex items-center justify-between border-t border-[var(--border)] pt-6">
          {prev ? (
            <Button asChild variant="ghost">
              <Link
                href={`/modules/${moduleSlug}/chapter/${chapterSlug}/theory/${prev.slug}`}
              >
                <ArrowLeftIcon className="size-4" />
                <span className="text-xs">Précédent : {prev.title}</span>
              </Link>
            </Button>
          ) : (
            <span />
          )}
          <Suspense>
            <MarkReadButton
              sectionId={section.id}
              nextHref={
                next
                  ? `/modules/${moduleSlug}/chapter/${chapterSlug}/theory/${next.slug}`
                  : `/modules/${moduleSlug}/chapter/${chapterSlug}`
              }
              exercisesHref={`/modules/${moduleSlug}/chapter/${chapterSlug}/exercises`}
            />
          </Suspense>
          {next ? (
            <Button asChild variant="ghost">
              <Link
                href={`/modules/${moduleSlug}/chapter/${chapterSlug}/theory/${next.slug}`}
              >
                <span className="text-xs">Suivant : {next.title}</span>
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </AccessGuard>
  )
}
