"use client"

import { useProgress } from "@/components/use-progress"

export function BestGateScore({ moduleSlug }: { moduleSlug: string }) {
  const best = useProgress().modules.find(
    (m) => m.slug === moduleSlug
  )?.bestGateScore
  if (best == null) return null

  return (
    <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-3 py-2 font-mono text-xs">
      <span className="text-[var(--fg-2)]">Meilleur score :</span>
      <span className="text-[var(--accent)]">{Math.round(best * 100)}%</span>
    </div>
  )
}
