import { aggregateSubQuestions } from "./subQuestions"
import type {
  FigureInterpretPayload,
  FigureInterpretSolution,
  FigureInterpretSubmission,
  ValidationResult,
} from "./types"

export function validateFigureInterpret(
  payload: FigureInterpretPayload,
  solution: FigureInterpretSolution,
  submission: FigureInterpretSubmission | null | undefined,
  explanation: string,
): ValidationResult {
  return aggregateSubQuestions(
    payload.subQuestions,
    solution.subSolutions,
    submission?.answers ?? {},
    explanation,
  )
}
