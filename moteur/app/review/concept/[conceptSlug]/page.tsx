import Link from "next/link"
import { notFound } from "next/navigation"
import { BookOpenIcon } from "lucide-react"
import { ModuleSidebar } from "@/components/study/ModuleSidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConceptDrillRunner } from "@/components/study/ConceptDrillRunner"
import { ConceptMasteryInfo } from "@/components/study/ConceptMasteryInfo"
import { getCatalog, getConceptLinks } from "@/lib/catalog"
import type { Exercise } from "@/lib/course"

export function generateStaticParams() {
  return getCatalog().concepts.map((c) => ({ conceptSlug: c.slug }))
}

export default async function ConceptDrillPage(props: { params: Promise<{ conceptSlug: string }> }) {
  const { conceptSlug } = await props.params
  const concept = getCatalog().concepts.find((c) => c.slug === conceptSlug)
  if (!concept) notFound()

  const { sections: sectionLinks, exercises: linked } = getConceptLinks(conceptSlug)

  // Pick up to 5 exercises across the concept, prioritizing diverse types
  const seenTypes = new Set<string>()
  const exercises: Exercise[] = []
  for (const exercise of linked) {
    if (exercises.length >= 5) break
    if (!seenTypes.has(exercise.type)) {
      exercises.push(exercise)
      seenTypes.add(exercise.type)
    }
  }
  while (exercises.length < Math.min(5, linked.length)) {
    const next = linked.find((e) => !exercises.includes(e))
    if (!next) break
    exercises.push(next)
  }

  return (
    <div className="flex min-h-svh">
      <ModuleSidebar />
      <main className="mx-auto max-w-3xl px-8 py-12">
        <Link href="/review" className="mono-label hover:text-[var(--fg-0)]">
          ← révision
        </Link>

        <div className="mt-3 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <span className="mono-label">concept</span>
            <ConceptMasteryInfo conceptSlug={concept.slug} />
          </div>
          <h1 className="mt-2 font-mono text-2xl tracking-tight">{concept.label}</h1>
          {concept.summary && <p className="mt-2 text-sm text-[var(--fg-2)]">{concept.summary}</p>}
        </div>

        {sectionLinks.length > 0 && (
          <div className="mt-6 card-elevated p-4">
            <div className="mono-label mb-2 flex items-center gap-1.5">
              <BookOpenIcon className="size-3" />
              Rappels théorie
            </div>
            <ul className="space-y-1">
              {sectionLinks.map((l) => {
                return (
                  <li key={l.section.id}>
                    <Link
                      href={`/modules/${l.moduleSlug}/chapter/${l.chapterSlug}/theory/${l.section.slug}`}
                      className="flex items-center justify-between font-mono text-xs text-[var(--accent)] hover:underline"
                    >
                      <span>↗ {l.section.title}</span>
                      <span className="text-[var(--fg-3)]">
                        {l.moduleTitle} / {l.chapterTitle}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {exercises.length === 0 ? (
          <div className="mt-8 card-elevated p-6 text-center">
            <p className="text-sm text-[var(--fg-2)]">Aucun exercice lié à ce concept pour le moment.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/review">Retour</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="mono-label mb-3 flex items-center gap-2">
              Drill — {exercises.length} exercice{exercises.length > 1 ? "s" : ""}
              <Badge variant="outline" className="border-[var(--border-strong)] font-mono text-[9px]">
                types : {Array.from(new Set(exercises.map((e) => e.type))).map((t) => t.split("_")[0]).join(", ")}
              </Badge>
            </h2>
            <ConceptDrillRunner conceptSlug={concept.slug} exercises={exercises} />
          </div>
        )}
      </main>
    </div>
  )
}
