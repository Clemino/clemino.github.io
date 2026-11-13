"use client"

import { useProgress } from "@/components/use-progress"
import { NEW_MASTERY } from "@/lib/store"

export function ConceptMasteryInfo({ conceptSlug }: { conceptSlug: string }) {
  const { reps, ease, interval } =
    useProgress().data.mastery[conceptSlug] ?? NEW_MASTERY

  return (
    <span className="font-mono text-[10px] text-[var(--fg-3)]">
      {reps}× · ease {ease.toFixed(2)} · intervalle {interval}j
    </span>
  )
}
