import { aggregateSubQuestions } from "./subQuestions"
import type {
  CodeAnalysisPayload,
  CodeAnalysisSolution,
  CodeAnalysisSubmission,
  ValidationResult,
} from "./types"

export function validateCodeAnalysis(
  payload: CodeAnalysisPayload,
  solution: CodeAnalysisSolution,
  submission: CodeAnalysisSubmission | null | undefined,
  explanation: string
): ValidationResult {
  return aggregateSubQuestions(
    payload.subQuestions,
    solution.subSolutions,
    submission?.answers ?? {},
    explanation
  )
}
