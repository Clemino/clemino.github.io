import { validateMcqSingle, validateMcqMulti, validateTrueFalse } from "./choice"
import { validateFillBlank } from "./fillBlank"
import { validateNumeric } from "./numeric"
import { validatePredictOutput } from "./predictOutput"
import type {
  AnySubmission,
  SubQuestion,
  SubSolution,
  ValidationResult,
} from "./types"

const VALID_SUB_TYPES = new Set([
  "MCQ_SINGLE",
  "MCQ_MULTI",
  "TRUE_FALSE",
  "FILL_BLANK",
  "NUMERIC",
  "PREDICT_OUTPUT",
])

/**
 * Aggregates sub-question results for container exercise types (CODE_ANALYSIS, FIGURE_INTERPRET…).
 * Delegates to primitive validators directly — never calls global validate() — so stays synchronous
 * and avoids any recursion risk.
 */
export function aggregateSubQuestions(
  subQuestions: SubQuestion[],
  subSolutions: SubSolution[],
  answers: Record<string, AnySubmission>,
  explanation: string,
): ValidationResult {
  let weightedScore = 0
  let totalWeight = 0
  let allPassed = true
  const feedbackCriteria: ValidationResult["feedback"] = []
  const canonicalParts: string[] = []

  for (let i = 0; i < subQuestions.length; i++) {
    const subQ = subQuestions[i]
    const prefix = `Q${i + 1}.`
    const weight = subQ.weight ?? 1

    // Guard: type must be one of the 6 primitive SubQuestionType values
    if (!VALID_SUB_TYPES.has(subQ.type)) {
      allPassed = false
      totalWeight += weight
      feedbackCriteria.push({
        ok: false,
        criterion: `${prefix}Type de sous-question invalide : ${subQ.type}`,
      })
      canonicalParts.push(`${prefix} (type invalide)`)
      continue
    }

    const subSol = subSolutions.find((s) => s.id === subQ.id)
    const answer = answers[subQ.id]

    // Fix: if the student did not answer this sub-question at all, record a
    // direct failing result — do NOT fabricate a "safe empty submission" and
    // delegate to the primitive validator, because some fabricated values
    // accidentally match correct answers (e.g. TRUE_FALSE with answer false).
    if (answer === undefined || answer === null) {
      allPassed = false
      totalWeight += weight
      feedbackCriteria.push({
        ok: false,
        criterion: `${prefix} Non répondu`,
      })
      canonicalParts.push(`${prefix} (non répondu)`)
      continue
    }

    let subResult: ValidationResult

    // Direct dispatch to primitive validators — synchronous, no recursion
    switch (subQ.type) {
      case "MCQ_SINGLE":
        subResult = validateMcqSingle(
          subQ.payload as never,
          (subSol?.solution ?? { correct: [] }) as never,
          answer as never,
          "",
        )
        break
      case "MCQ_MULTI":
        subResult = validateMcqMulti(
          subQ.payload as never,
          (subSol?.solution ?? { correct: [] }) as never,
          answer as never,
          "",
        )
        break
      case "TRUE_FALSE":
        subResult = validateTrueFalse(
          subQ.payload as never,
          (subSol?.solution ?? { value: true }) as never,
          answer as never,
          "",
        )
        break
      case "FILL_BLANK":
        subResult = validateFillBlank(
          subQ.payload as never,
          (subSol?.solution ?? { answers: {} }) as never,
          answer as never,
          "",
        )
        break
      case "NUMERIC":
        subResult = validateNumeric(
          subQ.payload as never,
          (subSol?.solution ?? { value: 0 }) as never,
          answer as never,
          "",
        )
        break
      case "PREDICT_OUTPUT":
        subResult = validatePredictOutput(
          subQ.payload as never,
          (subSol?.solution ?? { expectedOutput: "" }) as never,
          answer as never,
          "",
        )
        break
    }

    if (!subResult.passed) allPassed = false

    weightedScore += weight * subResult.score
    totalWeight += weight

    // Prefix each criterion label with Qn.
    for (const c of subResult.feedback) {
      feedbackCriteria.push({
        ...c,
        criterion: `${prefix}${c.criterion}`,
      })
    }

    canonicalParts.push(`${prefix} ${subResult.reveal.canonicalSolution}`)
  }

  const score = totalWeight > 0 ? weightedScore / totalWeight : 0

  return {
    passed: allPassed && subQuestions.length > 0,
    score,
    feedback: feedbackCriteria,
    reveal: {
      canonicalSolution: canonicalParts.join("\n"),
      explanation,
    },
  }
}
