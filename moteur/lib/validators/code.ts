import type { CodeSolution, CodeSubmission, ValidationResult } from "./types"

export const CODE_CHECKS = [
  { id: "compiles", label: "Mon code compile sans erreur" },
  { id: "output", label: "Il donne la sortie attendue sur chaque test" },
  { id: "understood", label: "J'ai compris les différences avec la solution" },
]

/** Nothing can compile on a static site: the score is the student's own check against the reference. */
export function validateCode(solution: CodeSolution, submission: CodeSubmission, explanation: string): ValidationResult {
  const checked = new Set(submission.checked)
  const feedback = CODE_CHECKS.map((c) => ({ ok: checked.has(c.id), criterion: c.label }))
  const score = feedback.filter((f) => f.ok).length / feedback.length
  return {
    passed: score === 1,
    score,
    feedback,
    reveal: { canonicalSolution: solution.referenceCode, explanation },
  }
}
