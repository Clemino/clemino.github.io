import { numericMatch } from "./normalize"
import type { NumericPayload, NumericSolution, NumericSubmission, ValidationResult } from "./types"

export function validateNumeric(
  payload: NumericPayload,
  solution: NumericSolution,
  submission: NumericSubmission,
  explanation: string,
): ValidationResult {
  // Parse submission: trim, replace decimal comma, then Number()
  const raw = (submission?.value ?? "").trim().replace(/,/g, ".")
  const x = Number(raw)

  const canonicalSolution = payload.unit
    ? `${solution.value} ${payload.unit}`
    : String(solution.value)

  // Non-numeric or empty input
  if (raw === "" || isNaN(x)) {
    return {
      passed: false,
      score: 0,
      feedback: [{ ok: false, criterion: "Réponse non numérique" }],
      reveal: { canonicalSolution, explanation },
    }
  }

  const toleranceOpts = { absTol: solution.absTol, relTol: solution.relTol }

  // Check primary target and any acceptedValues
  const targets = [solution.value, ...(solution.acceptedValues ?? [])]
  const ok = targets.some((t) => numericMatch(x, t, toleranceOpts))

  if (ok) {
    return {
      passed: true,
      score: 1,
      feedback: [{ ok: true, criterion: "Valeur correcte", detail: "La réponse est dans la tolérance attendue." }],
      reveal: { canonicalSolution, explanation },
    }
  }

  // Build a human-readable tolerance detail
  const parts: string[] = []
  if (solution.absTol !== undefined && solution.absTol > 0) {
    parts.push(`± ${solution.absTol} (tolérance absolue)`)
  }
  if (solution.relTol !== undefined) {
    parts.push(`± ${solution.relTol * 100}% (tolérance relative)`)
  }
  const toleranceDetail = parts.length > 0 ? ` (${parts.join(", ")})` : ""

  return {
    passed: false,
    score: 0,
    feedback: [
      {
        ok: false,
        criterion: `Valeur attendue : ${canonicalSolution}${toleranceDetail}`,
        detail: `Tu as répondu ${x}, mais la valeur attendue est ${solution.value}${toleranceDetail}.`,
      },
    ],
    reveal: { canonicalSolution, explanation },
  }
}
