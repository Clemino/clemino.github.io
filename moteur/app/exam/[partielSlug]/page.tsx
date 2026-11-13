import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, AlertTriangleIcon, ClockIcon } from "lucide-react"
import { ExamRecentRuns } from "@/components/exam/ExamRecentRuns"
import { ModuleSidebar } from "@/components/study/ModuleSidebar"
import { StartExamButton } from "@/components/exam/StartExamButton"
import { getCatalog, getExam } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog().exams.map((e) => ({ partielSlug: e.slug }))
}

export default async function ExamIntroPage(props: { params: Promise<{ partielSlug: string }> }) {
  const { partielSlug } = await props.params
  const exam = getExam(partielSlug)
  if (!exam) notFound()

  return (
    <div className="flex min-h-svh">
      <ModuleSidebar />
      <main className="mx-auto max-w-3xl px-8 py-12">
        <Link href="/exam" className="mono-label hover:text-[var(--fg-0)]">
          <ArrowLeftIcon className="inline size-3" /> mode partiel
        </Link>

        <h1 className="mt-3 font-mono text-3xl tracking-tight">{exam.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-1)]">{exam.description}</p>

        <div className="mt-10 grid grid-cols-3 gap-3">
          <div className="card-elevated p-4 text-center">
            <ClockIcon className="mx-auto size-5 text-[var(--accent)]" />
            <div className="mt-2 font-mono text-2xl tabular-nums">{exam.durationMinutes}</div>
            <div className="mono-label">minutes</div>
          </div>
          <div className="card-elevated p-4 text-center">
            <div className="mx-auto flex size-5 items-center justify-center font-mono text-lg text-[var(--accent)]">Q</div>
            <div className="mt-2 font-mono text-2xl tabular-nums">{exam.exercises.length}</div>
            <div className="mono-label">questions</div>
          </div>
          <div className="card-elevated p-4 text-center">
            <div className="mx-auto flex size-5 items-center justify-center font-mono text-lg text-[var(--accent)]">/</div>
            <div className="mt-2 font-mono text-2xl tabular-nums">{exam.totalPoints}</div>
            <div className="mono-label">noté sur</div>
          </div>
        </div>

        <div className="mt-8 card-elevated p-5">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" />
            <div className="text-xs text-[var(--fg-1)]">
              <div className="mb-2 font-mono text-sm text-[var(--fg-0)]">Mode examen</div>
              <ul className="list-disc space-y-1 pl-4">
                <li>{"Aucun feedback ne s'affiche pendant l'examen — uniquement à la fin."}</li>
                <li>{"Le minuteur tourne en arrière-plan. À 0:00, l'examen est soumis automatiquement."}</li>
                <li>{"Tu peux revenir sur les questions précédentes tant que le temps n'est pas écoulé."}</li>
                <li>Tu peux soumettre avant la fin du temps.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <StartExamButton examSlug={exam.slug} />
        </div>

        <ExamRecentRuns examSlug={exam.slug} />
      </main>
    </div>
  )
}
