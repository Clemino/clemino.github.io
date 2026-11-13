"use client"

import Link from "next/link"
import { useProgress } from "@/components/use-progress"

export function ExamRecentRuns({ examSlug }: { examSlug: string }) {
  const { data } = useProgress()
  const runs = data.examRuns
    .filter((r) => r.examSlug === examSlug)
    .slice(-5)
    .reverse()
  if (runs.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="mono-label mb-3">Tentatives récentes</h2>
      <ul className="divide-y divide-[var(--border)] rounded-md border border-[var(--border)] bg-[var(--bg-1)]">
        {runs.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between px-4 py-2.5"
          >
            <span className="font-mono text-xs text-[var(--fg-2)]">
              {new Date(r.startedAt).toLocaleString("fr-FR")}
            </span>
            {r.endedAt ? (
              <Link
                href={`/exam/${examSlug}/result?run=${r.id}`}
                className="font-mono text-sm text-[var(--accent)] hover:underline"
              >
                {r.noteSur20?.toFixed(1)} / 20
              </Link>
            ) : (
              <Link
                href={`/exam/${examSlug}/run?run=${r.id}`}
                className="font-mono text-xs text-[var(--warning)] hover:underline"
              >
                en cours →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
