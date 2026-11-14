import { aggregateSubQuestions } from "./subQuestions"
import type {
  CaseStudyPayload,
  CaseStudySolution,
  CaseStudySubmission,
  ValidationResult,
} from "./types"

export function validateCaseStudy(
  payload: CaseStudyPayload,
  solution: CaseStudySolution,
  submission: CaseStudySubmission | null | undefined,
  explanation: string
): ValidationResult {
  return aggregateSubQuestions(
    payload.subQuestions,
    solution.subSolutions,
    submission?.answers ?? {},
    explanation
  )
}
