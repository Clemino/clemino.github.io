import type { Exercise } from "@/lib/course"
import {
  NEW_MASTERY,
  useProgressStore,
  type AttemptSource,
  type Mastery,
} from "@/lib/store"
import { validate, type ValidationResult } from "@/lib/validators"
import type { AnySubmission } from "@/lib/validators/types"

export type SubmitInput = {
  exercise: Exercise
  submission: AnySubmission
  source?: AttemptSource
  runId?: string
}

function afterSuccess(mastery: Mastery): Mastery {
  const interval = Math.max(1, Math.round(mastery.interval * mastery.ease))
  return {
    ...mastery,
    reps: mastery.reps + 1,
    interval,
    dueAt: new Date(Date.now() + interval * 24 * 3600 * 1000).toISOString(),
    lastGrade: 5,
  }
}

export async function submitAttempt({
  exercise,
  submission,
  source = "PRACTICE",
  runId,
}: SubmitInput): Promise<ValidationResult> {
  const result = await validate({
    type: exercise.type,
    payload: exercise.payload,
    solution: exercise.solution,
    submission,
    explanation: exercise.explanation,
  })

  useProgressStore.setState((s) => {
    const mastery = { ...s.mastery }
    if (result.passed) {
      for (const slug of exercise.concepts)
        mastery[slug] = afterSuccess(mastery[slug] ?? NEW_MASTERY)
    }
    return {
      mastery,
      attempts: [
        ...s.attempts,
        {
          exerciseId: exercise.id,
          score: result.score,
          passed: result.passed,
          source,
          runId,
          ...(source === "GATE" ? { submission } : {}),
          createdAt: new Date().toISOString(),
        },
      ],
    }
  })

  return result
}
