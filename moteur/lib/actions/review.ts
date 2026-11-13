import { NEW_MASTERY, useProgressStore } from "@/lib/store"

/**
 * SM-2 update on a concept after a review attempt.
 * grade: 0-5 quality of the recall (5 = perfect, 0 = blackout)
 */
export function gradeConcept(conceptSlug: string, grade: number) {
  useProgressStore.setState((s) => {
    const q = Math.max(0, Math.min(5, grade))
    let { ease, interval, reps } = s.mastery[conceptSlug] ?? NEW_MASTERY

    if (q < 3) {
      // Failed: reset reps and interval
      reps = 0
      interval = 1
    } else {
      reps = reps + 1
      if (reps === 1) interval = 1
      else if (reps === 2) interval = 6
      else interval = Math.round(interval * ease)
    }

    // Update ease factor (clamped)
    ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))

    const dueAt = new Date(
      Date.now() + interval * 24 * 3600 * 1000
    ).toISOString()
    return {
      mastery: {
        ...s.mastery,
        [conceptSlug]: { ease, interval, reps, dueAt, lastGrade: grade },
      },
    }
  })
}
