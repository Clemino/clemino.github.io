"use client"

import Link from "next/link"
import { ModuleSidebar } from "@/components/study/ModuleSidebar"
import { useProgress } from "@/components/use-progress"

export default function StatsPage() {
  const { modules, data, conceptCount, masteredCount: masteredConcepts } = useProgress()
  const attempts = data.attempts.filter((a) => a.source !== "SKIP")
  const totalAttempts = attempts.length
  const passedAttempts = attempts.filter((a) => a.passed).length

  return (
    <div className="flex min-h-svh">
      <ModuleSidebar />
      <main className="mx-auto max-w-4xl px-8 py-12">
        <Link href="/" className="mono-label hover:text-[var(--fg-0)]">← accueil</Link>
        <h1 className="mt-3 font-mono text-3xl tracking-tight">Statistiques</h1>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card label="Tentatives" value={totalAttempts.toString()} />
          <Card label="Réussies" value={`${passedAttempts}`} hint={totalAttempts ? `${Math.round((passedAttempts / totalAttempts) * 100)}%` : "—"} />
          <Card label="Concepts maîtrisés" value={`${masteredConcepts}/${conceptCount}`} />
          <Card label="Modules" value={`${modules.filter((m) => m.completed).length}/${modules.length}`} />
        </div>

        <h2 className="mt-12 font-mono text-sm tracking-widest uppercase text-[var(--fg-2)]">Progression par module</h2>
        <ul className="mt-3 space-y-2">
          {modules.map((m) => (
            <li key={m.slug} className="card-elevated flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-mono text-sm">{m.title}</div>
                <div className="mt-1 font-mono text-[10px] text-[var(--fg-3)]">
                  {m.exercisesDone}/{m.exercisesTotal} exercices · gate {m.bestGateScore != null ? `${Math.round(m.bestGateScore * 100)}%` : "—"}
                </div>
              </div>
              <div className="font-mono text-xl tabular-nums text-[var(--accent)]">
                {m.exercisesTotal > 0 ? Math.round((m.exercisesDone / m.exercisesTotal) * 100) : 0}%
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card-elevated p-4">
      <div className="mono-label">{label}</div>
      <div className="mt-2 font-mono text-xl tabular-nums">{value}</div>
      {hint && <div className="mt-1 font-mono text-[10px] text-[var(--fg-3)]">{hint}</div>}
    </div>
  )
}
