import { normalize } from "./normalize"
import type {
  PredictOutputPayload,
  PredictOutputSolution,
  PredictOutputSubmission,
  ValidationResult,
} from "./types"

export function validatePredictOutput(
  _payload: PredictOutputPayload,
  solution: PredictOutputSolution,
  submission: PredictOutputSubmission,
  explanation: string,
): ValidationResult {
  const expected = normalize(solution.expectedOutput ?? "")
  const submitted = normalize(submission?.output ?? "")
  const ok = expected === submitted
  return {
    passed: ok,
    score: ok ? 1 : 0,
    feedback: [
      {
        ok,
        criterion: "Sortie attendue",
        detail: ok ? "Sortie identique au programme." : "La sortie prédite diffère de la sortie réelle.",
      },
    ],
    reveal: { canonicalSolution: solution.expectedOutput ?? "", explanation },
  }
}
