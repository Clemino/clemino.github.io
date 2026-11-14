import {
  validateMcqMulti,
  validateMcqSingle,
  validateTrueFalse,
} from "./choice"
import { validateFillBlank } from "./fillBlank"
import { validateMatching } from "./matching"
import { validateOrdering } from "./ordering"
import { validateCaseStudy } from "./caseStudy"
import { validateWriting } from "./writing"
import { validateAlgoTrace } from "./algoTrace"
import { validateChartRead } from "./chartRead"
import { validateCode } from "./code"
import { validateCodeAnalysis } from "./codeAnalysis"
import { validateFigureInterpret } from "./figureInterpret"
import { validateNumeric } from "./numeric"
import {
  validatePetriEnabledTransitions,
  validatePetriFireSequence,
  validatePetriInvariant,
  validatePetriMatrix,
  validatePetriProperty,
  validatePetriReachability,
} from "./petri"
import { validatePlsqlProc } from "./plsqlProc"
import { validatePlsqlTrigger } from "./plsqlTrigger"
import { validatePredictOutput } from "./predictOutput"
import { validateRubric } from "./rubric"
import { validateSqlDdl } from "./sqlDdl"
import { validateTrace } from "./trace"
import { validateTradePlan } from "./tradePlan"
import type {
  AnyPayload,
  AnySolution,
  AnySubmission,
  ExerciseType,
  ValidationResult,
} from "./types"

export type ValidateInput = {
  type: ExerciseType
  payload: AnyPayload
  solution: AnySolution
  submission: AnySubmission
  explanation: string
}

export async function validate(
  input: ValidateInput
): Promise<ValidationResult> {
  const { type, payload, solution, submission, explanation } = input
  switch (type) {
    case "MCQ_SINGLE":
      return validateMcqSingle(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "MCQ_MULTI":
      return validateMcqMulti(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "TRUE_FALSE":
      return validateTrueFalse(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "FILL_BLANK":
      return validateFillBlank(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "ORDERING":
      return validateOrdering(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "MATCHING":
      return validateMatching(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "CASE_STUDY":
      return validateCaseStudy(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "WRITING":
      return validateWriting(payload as never, submission as never, explanation)
    case "PREDICT_OUTPUT":
      return validatePredictOutput(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "NUMERIC":
      return validateNumeric(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "ALGO_TRACE":
      return validateAlgoTrace(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "CODE_ANALYSIS":
      return validateCodeAnalysis(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "FIGURE_INTERPRET":
      return validateFigureInterpret(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "PETRI_ENABLED_TRANSITIONS":
      return validatePetriEnabledTransitions(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "PETRI_FIRE_SEQUENCE":
      return validatePetriFireSequence(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "PETRI_MATRIX":
      return validatePetriMatrix(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "PETRI_PROPERTY":
      return validatePetriProperty(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "PETRI_INVARIANT":
      return validatePetriInvariant(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "PETRI_REACHABILITY":
      return validatePetriReachability(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "SQL_DDL":
      return validateSqlDdl(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "PLSQL_TRIGGER":
      return validatePlsqlTrigger(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "TRACE_EXECUTION":
      return validateTrace(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "RUBRIC_OPEN":
      return validateRubric(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "CHART_READ":
      return validateChartRead(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "TRADE_PLAN":
      return validateTradePlan(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "PLSQL_PROCEDURE":
    case "PLSQL_BLOCK":
      return validatePlsqlProc(
        payload as never,
        solution as never,
        submission as never,
        explanation
      )
    case "CODE_WRITE":
    case "CODE_FIX":
      return validateCode(solution as never, submission as never, explanation)
    default: {
      const exhaustive: never = type
      return {
        passed: false,
        score: 0,
        feedback: [
          {
            ok: false,
            criterion: `Type d'exercice inconnu: ${String(exhaustive)}`,
          },
        ],
        reveal: { canonicalSolution: "", explanation },
      }
    }
  }
}

export type { ValidationResult } from "./types"
