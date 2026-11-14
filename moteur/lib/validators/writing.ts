import type {
  ValidationResult,
  WritingPayload,
  WritingSubmission,
} from "./types"

export const WRITING_THRESHOLD = 0.7

/** A written answer cannot be graded automatically: the score is the student's own rubric. */
export function validateWriting(
  payload: WritingPayload,
  submission: WritingSubmission,
  explanation: string
): ValidationResult {
  const checked = new Set(submission.checked ?? [])
  const feedback = payload.rubric.map((c) => ({
    ok: checked.has(c.id),
    criterion: c.label,
  }))
  const score = feedback.length
    ? feedback.filter((f) => f.ok).length / feedback.length
    : 0
  return {
    passed: score >= WRITING_THRESHOLD,
    score,
    feedback,
    reveal: {
      canonicalSolution: "Voir le corrigé type ci-dessus.",
      explanation,
    },
  }
}
