import type {
  ChartLevel,
  ChartOverlay,
  FigureSpec,
} from "@/components/figures/types"
import type { Candle } from "@/lib/ohlc"

export type ExerciseType =
  | "MCQ_SINGLE"
  | "MCQ_MULTI"
  | "TRUE_FALSE"
  | "FILL_BLANK"
  | "ORDERING"
  | "MATCHING"
  | "CASE_STUDY"
  | "WRITING"
  | "PREDICT_OUTPUT"
  | "NUMERIC"
  | "ALGO_TRACE"
  | "CODE_ANALYSIS"
  | "FIGURE_INTERPRET"
  | "PETRI_ENABLED_TRANSITIONS"
  | "PETRI_FIRE_SEQUENCE"
  | "PETRI_MATRIX"
  | "PETRI_PROPERTY"
  | "PETRI_INVARIANT"
  | "PETRI_REACHABILITY"
  | "CODE_WRITE"
  | "CODE_FIX"
  | "SQL_DDL"
  | "PLSQL_BLOCK"
  | "PLSQL_TRIGGER"
  | "PLSQL_PROCEDURE"
  | "TRACE_EXECUTION"
  | "RUBRIC_OPEN"
  | "CHART_READ"
  | "TRADE_PLAN"

export type AttemptSource = "PRACTICE" | "GATE" | "REVIEW" | "EXAM"

export type ValidationCriterion = {
  ok: boolean
  criterion: string
  detail?: string
  weight?: number
}
export type ValidationResult = {
  passed: boolean
  score: number
  feedback: ValidationCriterion[]
  reveal: { canonicalSolution: string; explanation: string }
}

// MCQ
export type McqOption = { id: string; label: string }
export type McqPayload = { options: McqOption[]; shuffle?: boolean }
export type McqSolution = { correct: string[] }
export type McqSubmission = { selected: string[] }

// True/False
export type TrueFalsePayload = Record<string, never>
export type TrueFalseSolution = { value: boolean }
export type TrueFalseSubmission = { value: boolean }

// Fill in the blank
export type FillBlankSlot = {
  id: string
  width?: "sm" | "md" | "lg"
  placeholder?: string
  hint?: string
}
export type FillBlankPayload = { template: string; slots: FillBlankSlot[] }
export type FillBlankSolution = {
  answers: Record<string, string | string[]>
  caseSensitive?: boolean
  stripAccents?: boolean
}
export type FillBlankSubmission = { values: Record<string, string> }

// Ordering
export type OrderingItem = { id: string; label: string }
export type OrderingPayload = { items: OrderingItem[] }
export type OrderingSolution = { order: string[] }
export type OrderingSubmission = { order: string[] }

// Matching
export type MatchingPair = { id: string; label: string }
export type MatchingPayload = { left: MatchingPair[]; right: MatchingPair[] }
export type MatchingSolution = { pairs: Record<string, string> }
export type MatchingSubmission = { pairs: Record<string, string> }

// Case study: a statement of facts followed by guided sub-questions
export type SubQuestionType =
  | "MCQ_SINGLE"
  | "MCQ_MULTI"
  | "TRUE_FALSE"
  | "FILL_BLANK"
  | "NUMERIC"
  | "PREDICT_OUTPUT"
export type SubQuestion = {
  id: string
  type: SubQuestionType
  prompt: string
  weight?: number
  payload: AnyPayload
}
export type SubSolution = { id: string; solution: AnySolution }
export type CaseStudyPayload = { scenario: string; subQuestions: SubQuestion[] }
export type CaseStudySolution = { subSolutions: SubSolution[] }
export type CaseStudySubmission = { answers: Record<string, AnySubmission> }

// Writing: free text compared with a model answer, then graded by the student on a rubric
export type WritingCriterion = { id: string; label: string }
export type WritingPayload = { modelAnswer: string; rubric: WritingCriterion[] }
export type WritingSolution = Record<string, never>
export type WritingSubmission = { text: string; checked: string[] }

// Numeric, traces and container exercises
export type NumericPayload = {
  unit?: string
  placeholder?: string
  hint?: string
}
export type NumericSolution = {
  value: number
  absTol?: number
  relTol?: number
  acceptedValues?: number[]
}
export type NumericSubmission = { value: string }
export type AlgoTraceCell = {
  id: string
  label: string
  kind?: "number" | "text"
  placeholder?: string
}
export type AlgoTracePayload = {
  description?: string
  figure?: FigureSpec
  cells: AlgoTraceCell[]
}
export type AlgoTraceCellSolution = {
  id: string
  expected: string | number
  absTol?: number
  relTol?: number
  accepted?: string[]
}
export type AlgoTraceSolution = {
  cells: AlgoTraceCellSolution[]
  caseSensitive?: boolean
  stripAccents?: boolean
}
export type AlgoTraceSubmission = { values: Record<string, string> }
export type CodeAnalysisPayload = {
  code: string
  language: "python" | "r" | "keras" | "pseudocode"
  caption?: string
  subQuestions: SubQuestion[]
}
export type CodeAnalysisSolution = { subSolutions: SubSolution[] }
export type CodeAnalysisSubmission = { answers: Record<string, AnySubmission> }
export type FigureInterpretPayload = {
  figure: FigureSpec
  caption?: string
  subQuestions: SubQuestion[]
}
export type FigureInterpretSolution = { subSolutions: SubSolution[] }
export type FigureInterpretSubmission = {
  answers: Record<string, AnySubmission>
}

// Predicted output and Petri nets
export type PredictOutputPayload = { program: string; language?: string }
export type PredictOutputSolution = { expectedOutput: string }
export type PredictOutputSubmission = { output: string }
export type PetriPlace = {
  id: string
  label?: string
  tokens?: number
  x?: number
  y?: number
}
export type PetriTransition = {
  id: string
  label?: string
  x?: number
  y?: number
}
export type PetriArc = { from: string; to: string; weight?: number }
export type PetriNetPayload = {
  places: PetriPlace[]
  transitions: PetriTransition[]
  arcs: PetriArc[]
  marking?: Record<string, number>
}
export type PetriEnabledTransitionsPayload = PetriNetPayload
export type PetriEnabledTransitionsSolution = { enabledTransitionIds: string[] }
export type PetriEnabledTransitionsSubmission = {
  selectedTransitionIds: string[]
}
export type PetriFireSequencePayload = PetriNetPayload & { sequence: string[] }
export type PetriFireSequenceSolution = {
  finalMarking: Record<string, number>
  valid?: boolean
}
export type PetriFireSequenceSubmission = { marking: Record<string, number> }
export type PetriMatrixPayload = PetriNetPayload & {
  matrix: "pre" | "post" | "incidence"
  editableCells?: Array<{ placeId: string; transitionId: string }>
}
export type PetriMatrixSolution = {
  matrix: Record<string, Record<string, number>>
}
export type PetriMatrixSubmission = {
  matrix: Record<string, Record<string, number>>
}
export type PetriPropertyPayload = PetriNetPayload & {
  properties: Array<{ id: string; label: string }>
}
export type PetriPropertySolution = { correct: string[] }
export type PetriPropertySubmission = { selected: string[] }
export type PetriInvariantPayload = PetriNetPayload & {
  invariantType: "place" | "transition"
  vectors: Array<{ id: string; label: string; values: Record<string, number> }>
}
export type PetriInvariantSolution = { correct: string[] }
export type PetriInvariantSubmission = { selected: string[] }
export type PetriReachabilityPayload = PetriNetPayload & {
  graph?: {
    nodes: Array<{
      id: string
      label: string
      marking: Record<string, number>
      x?: number
      y?: number
    }>
    edges: Array<{ from: string; to: string; transitionId: string }>
  }
  options: McqOption[]
}
export type PetriReachabilitySolution = McqSolution
export type PetriReachabilitySubmission = McqSubmission

// Code: no compiler runs on a static site, so the student grades their own work
export type CodeTest = {
  name: string
  stdin?: string
  expectedStdout: string
  hidden?: boolean
  compare?: string
}
export type CodePayload = {
  spec: string
  starterCode?: string
  std?: string
  compare?: string
  tests: CodeTest[]
}
export type CodeSolution = { referenceCode: string }
export type CodeSubmission = { code: string; checked: string[] }

// SQL and PL/SQL, graded by reading the code
export type SqlDdlElement =
  | { kind: "table"; name: string; description?: string }
  | { kind: "column"; table: string; name: string; type?: string }
  | { kind: "constraint"; description: string; pattern: string }
  | { kind: "keyword"; keyword: string; description?: string }
  | {
      kind: "fk"
      from: { table: string; column: string }
      to: { table: string; column: string }
    }
export type SqlDdlPayload = {
  requiredElements: SqlDdlElement[]
  sandboxSlug?: string
}
export type SqlDdlSolution = { ddl: string }
export type SqlDdlSubmission = { ddl: string }
export type PlsqlTriggerRequirements = {
  triggerName?: string
  timing?: "BEFORE" | "AFTER" | "INSTEAD OF"
  events?: Array<"INSERT" | "UPDATE" | "DELETE">
  table?: string
  forEachRow?: boolean
  requiredKeywords?: string[]
  forbiddenKeywords?: string[]
}
export type PlsqlTriggerPayload = { required: PlsqlTriggerRequirements }
export type PlsqlTriggerSolution = { code: string }
export type PlsqlTriggerSubmission = { code: string }
export type PlsqlProcRequirements = {
  kind?: "PROCEDURE" | "FUNCTION" | "BLOCK"
  name?: string
  params?: Array<{
    name?: string
    mode?: "IN" | "OUT" | "IN OUT"
    type?: string
  }>
  returnType?: string
  requiredKeywords?: string[]
  requiredSections?: Array<"DECLARE" | "BEGIN" | "EXCEPTION" | "END">
}
export type PlsqlProcPayload = { required: PlsqlProcRequirements }
export type PlsqlProcSolution = { code: string }
export type PlsqlProcSubmission = { code: string }
export type TracePayload = {
  script: string
  format: "table" | "text"
  columns?: string[]
}
export type TraceSolution = {
  expectedOutput: string | string[][]
}
export type TraceSubmission = {
  output: string | string[][]
}
export type RubricCriterion = {
  id: string
  description: string
  keywords: string[]
  weight: number
  minMatches?: number
}
export type RubricPayload = {
  rubric: RubricCriterion[]
  minWords?: number
}
export type RubricSolution = { modelAnswer: string }
export type RubricSubmission = { text: string }

// Trading: reading a chart and building a trade plan. Candles are numbered from 1, as displayed.
export type ChartReadPayload = {
  mode: "candle" | "price" | "choice"
  candles: Candle[]
  overlays?: ChartOverlay[]
  levels?: ChartLevel[]
  showVolume?: boolean
  caption?: string
  options?: McqOption[]
}
export type ChartReadSolution = {
  candles?: number[]
  candleTol?: number
  price?: number
  priceTol?: number
  correct?: string
}
export type ChartReadSubmission = {
  candle?: number
  price?: number
  selected?: string
}

export type TradePlanPayload = {
  capital: number
  currency?: string
  direction: "long" | "short"
  maxRiskPct: number
  minRR: number
  /** Optional chart of the scenario. */
  figure?: FigureSpec
}
export type TradePlanFields = {
  entry: number
  stop: number
  target: number
  size: number
}
export type TradePlanSolution = {
  reference: TradePlanFields
  /** Optional constraints imposed by the scenario (e.g. entry on a breakout, stop under a support). */
  entryRange?: [number, number]
  stopRange?: [number, number]
  /** Rounding tolerance on position size, in units (default 1). */
  sizeTol?: number
}
export type TradePlanSubmission = {
  values: Partial<Record<keyof TradePlanFields, string>>
}

export type AnyPayload =
  | McqPayload
  | TrueFalsePayload
  | FillBlankPayload
  | OrderingPayload
  | MatchingPayload
  | CaseStudyPayload
  | WritingPayload
  | NumericPayload
  | AlgoTracePayload
  | CodeAnalysisPayload
  | FigureInterpretPayload
  | PredictOutputPayload
  | PetriEnabledTransitionsPayload
  | PetriFireSequencePayload
  | PetriMatrixPayload
  | PetriPropertyPayload
  | PetriInvariantPayload
  | PetriReachabilityPayload
  | SqlDdlPayload
  | PlsqlTriggerPayload
  | PlsqlProcPayload
  | TracePayload
  | RubricPayload
  | CodePayload
  | ChartReadPayload
  | TradePlanPayload
export type AnySolution =
  | McqSolution
  | TrueFalseSolution
  | FillBlankSolution
  | OrderingSolution
  | MatchingSolution
  | CaseStudySolution
  | WritingSolution
  | NumericSolution
  | AlgoTraceSolution
  | CodeAnalysisSolution
  | FigureInterpretSolution
  | PredictOutputSolution
  | PetriEnabledTransitionsSolution
  | PetriFireSequenceSolution
  | PetriMatrixSolution
  | PetriPropertySolution
  | PetriInvariantSolution
  | PetriReachabilitySolution
  | SqlDdlSolution
  | PlsqlTriggerSolution
  | PlsqlProcSolution
  | TraceSolution
  | RubricSolution
  | CodeSolution
  | ChartReadSolution
  | TradePlanSolution
export type AnySubmission =
  | McqSubmission
  | TrueFalseSubmission
  | FillBlankSubmission
  | OrderingSubmission
  | MatchingSubmission
  | CaseStudySubmission
  | WritingSubmission
  | NumericSubmission
  | AlgoTraceSubmission
  | CodeAnalysisSubmission
  | FigureInterpretSubmission
  | PredictOutputSubmission
  | PetriEnabledTransitionsSubmission
  | PetriFireSequenceSubmission
  | PetriMatrixSubmission
  | PetriPropertySubmission
  | PetriInvariantSubmission
  | PetriReachabilitySubmission
  | SqlDdlSubmission
  | PlsqlTriggerSubmission
  | PlsqlProcSubmission
  | TraceSubmission
  | RubricSubmission
  | CodeSubmission
  | ChartReadSubmission
  | TradePlanSubmission
