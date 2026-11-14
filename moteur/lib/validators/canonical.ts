import type {
  AlgoTracePayload,
  AlgoTraceSolution,
  AlgoTraceSubmission,
  AnyPayload,
  AnySolution,
  AnySubmission,
  CaseStudyPayload,
  CaseStudySolution,
  CaseStudySubmission,
  ChartReadPayload,
  ChartReadSolution,
  ChartReadSubmission,
  CodeSolution,
  CodeSubmission,
  ExerciseType,
  FillBlankSolution,
  FillBlankSubmission,
  MatchingPayload,
  MatchingSolution,
  MatchingSubmission,
  McqPayload,
  McqSolution,
  McqSubmission,
  NumericPayload,
  NumericSolution,
  NumericSubmission,
  OrderingPayload,
  OrderingSolution,
  OrderingSubmission,
  PetriEnabledTransitionsSolution,
  PetriEnabledTransitionsSubmission,
  PetriFireSequenceSolution,
  PetriFireSequenceSubmission,
  PetriInvariantPayload,
  PetriMatrixSolution,
  PetriMatrixSubmission,
  PetriPropertyPayload,
  PetriReachabilityPayload,
  PlsqlProcSolution,
  PlsqlProcSubmission,
  PredictOutputSolution,
  PredictOutputSubmission,
  RubricSolution,
  RubricSubmission,
  SqlDdlSolution,
  SqlDdlSubmission,
  SubQuestion,
  SubSolution,
  TraceSolution,
  TraceSubmission,
  TradePlanFields,
  TradePlanSolution,
  TradePlanSubmission,
  TrueFalseSolution,
  TrueFalseSubmission,
  WritingSubmission,
} from "./types"

const labels = (items: { id: string; label: string }[], ids: string[]) =>
  ids.map((id) => items.find((item) => item.id === id)?.label ?? id).join(" ; ")

const describeMarking = (marking: Record<string, number>) =>
  Object.entries(marking)
    .map(([place, tokens]) => `${place} = ${tokens}`)
    .join(", ")

const describeMatrix = (matrix: Record<string, Record<string, number>>) =>
  Object.entries(matrix)
    .map(([place, row]) => `${place} : ${Object.values(row).join(" ")}`)
    .join("\n")

const describeTrace = (output: string | string[][]) =>
  typeof output === "string"
    ? output
    : output.map((row) => row.join(" | ")).join("\n")

const describePlan = (
  plan: Partial<Record<keyof TradePlanFields, string | number>>
) =>
  `Entrée ${plan.entry ?? "—"} ; stop ${plan.stop ?? "—"} ; objectif ${plan.target ?? "—"} ; taille ${plan.size ?? "—"}`

function describeChartAnswer(
  payload: ChartReadPayload,
  candle?: number,
  price?: number,
  selected?: string
): string {
  if (payload.mode === "candle")
    return candle === undefined ? "—" : `Bougie ${candle}`
  if (payload.mode === "price") return price === undefined ? "—" : String(price)
  return selected ? labels(payload.options ?? [], [selected]) : "—"
}

function describeSubSolutions(
  subQuestions: SubQuestion[],
  subSolutions: SubSolution[]
): string {
  return subQuestions
    .map((q, i) => {
      const sub = subSolutions.find((s) => s.id === q.id)
      return `Q${i + 1}. ${sub ? canonicalSolution(q.type, q.payload, sub.solution) : "—"}`
    })
    .join("\n")
}

function describeSubAnswers(
  subQuestions: SubQuestion[],
  answers: Record<string, AnySubmission>
): string {
  return subQuestions
    .map(
      (q, i) =>
        `Q${i + 1}. ${describeSubmission(q.type, q.payload, answers[q.id])}`
    )
    .join("\n")
}

/** Expected answers a reminder must not quote, since a wrong try only shows the reminder. */
export function answerTexts(
  type: ExerciseType,
  payload: AnyPayload,
  solution: AnySolution
): string[] {
  if (type === "MCQ_SINGLE" || type === "MCQ_MULTI") {
    const { options } = payload as McqPayload
    const { correct } = solution as McqSolution
    return options.filter((o) => correct.includes(o.id)).map((o) => o.label)
  }
  if (type === "FILL_BLANK")
    return Object.values((solution as FillBlankSolution).answers).flat()
  return []
}

/** Readable expected answer, for screens that show a correction without a submission. */
export function canonicalSolution(
  type: ExerciseType,
  payload: AnyPayload,
  solution: AnySolution
): string {
  switch (type) {
    case "MCQ_SINGLE":
    case "MCQ_MULTI": {
      const { options } = payload as McqPayload
      return (solution as McqSolution).correct
        .map((id) => options.find((o) => o.id === id)?.label ?? id)
        .join(" ; ")
    }
    case "TRUE_FALSE":
      return (solution as TrueFalseSolution).value ? "Vrai" : "Faux"
    case "FILL_BLANK":
      return Object.values((solution as FillBlankSolution).answers)
        .map((a) => (Array.isArray(a) ? a[0] : a))
        .join(" ; ")
    case "ORDERING": {
      const { items } = payload as OrderingPayload
      return (solution as OrderingSolution).order
        .map(
          (id, i) =>
            `${i + 1}. ${items.find((it) => it.id === id)?.label ?? id}`
        )
        .join("\n")
    }
    case "MATCHING": {
      const { left, right } = payload as MatchingPayload
      return Object.entries((solution as MatchingSolution).pairs)
        .map(
          ([l, r]) =>
            `${left.find((x) => x.id === l)?.label ?? l} ↔ ${right.find((x) => x.id === r)?.label ?? r}`
        )
        .join("\n")
    }
    case "CASE_STUDY":
    case "CODE_ANALYSIS":
    case "FIGURE_INTERPRET":
      return describeSubSolutions(
        (payload as CaseStudyPayload).subQuestions,
        (solution as CaseStudySolution).subSolutions
      )
    case "WRITING":
      return "Voir le corrigé type de l'exercice."
    case "PREDICT_OUTPUT":
      return (solution as PredictOutputSolution).expectedOutput
    case "NUMERIC": {
      const { unit } = payload as NumericPayload
      return `${(solution as NumericSolution).value}${unit ? ` ${unit}` : ""}`
    }
    case "ALGO_TRACE": {
      const { cells } = payload as AlgoTracePayload
      return (solution as AlgoTraceSolution).cells
        .map(
          (c) =>
            `${cells.find((cell) => cell.id === c.id)?.label ?? c.id} : ${c.expected}`
        )
        .join("\n")
    }
    case "PETRI_ENABLED_TRANSITIONS":
      return (
        (solution as PetriEnabledTransitionsSolution).enabledTransitionIds.join(
          ", "
        ) || "Aucune"
      )
    case "PETRI_FIRE_SEQUENCE":
      return describeMarking(
        (solution as PetriFireSequenceSolution).finalMarking
      )
    case "PETRI_MATRIX":
      return describeMatrix((solution as PetriMatrixSolution).matrix)
    case "PETRI_PROPERTY":
      return labels(
        (payload as PetriPropertyPayload).properties,
        (solution as McqSolution).correct
      )
    case "PETRI_INVARIANT":
      return labels(
        (payload as PetriInvariantPayload).vectors,
        (solution as McqSolution).correct
      )
    case "PETRI_REACHABILITY":
      return labels(
        (payload as PetriReachabilityPayload).options,
        (solution as McqSolution).correct
      )
    case "CODE_WRITE":
    case "CODE_FIX":
      return (solution as CodeSolution).referenceCode
    case "SQL_DDL":
      return (solution as SqlDdlSolution).ddl
    case "PLSQL_BLOCK":
    case "PLSQL_TRIGGER":
    case "PLSQL_PROCEDURE":
      return (solution as PlsqlProcSolution).code
    case "TRACE_EXECUTION":
      return describeTrace((solution as TraceSolution).expectedOutput)
    case "RUBRIC_OPEN":
      return (solution as RubricSolution).modelAnswer
    case "CHART_READ": {
      const { candles, price, correct } = solution as ChartReadSolution
      return describeChartAnswer(
        payload as ChartReadPayload,
        candles?.[0],
        price,
        correct
      )
    }
    case "TRADE_PLAN":
      return describePlan((solution as TradePlanSolution).reference)
  }
}

/** What the student answered, in the same wording as the expected answer. */
export function describeSubmission(
  type: ExerciseType,
  payload: AnyPayload,
  submission?: AnySubmission
): string {
  if (!submission) return "Non répondu"
  switch (type) {
    case "MCQ_SINGLE":
    case "MCQ_MULTI":
      return canonicalSolution(type, payload, {
        correct: (submission as McqSubmission).selected,
      })
    case "TRUE_FALSE":
      return canonicalSolution(type, payload, submission as TrueFalseSubmission)
    case "FILL_BLANK":
      return canonicalSolution(type, payload, {
        answers: (submission as FillBlankSubmission).values,
      })
    case "ORDERING":
      return canonicalSolution(type, payload, submission as OrderingSubmission)
    case "MATCHING":
      return canonicalSolution(type, payload, submission as MatchingSubmission)
    case "CASE_STUDY":
    case "CODE_ANALYSIS":
    case "FIGURE_INTERPRET":
      return describeSubAnswers(
        (payload as CaseStudyPayload).subQuestions,
        (submission as CaseStudySubmission).answers
      )
    case "WRITING":
      return (submission as WritingSubmission).text
    case "PREDICT_OUTPUT":
      return (submission as PredictOutputSubmission).output
    case "NUMERIC": {
      const { unit } = payload as NumericPayload
      return `${(submission as NumericSubmission).value}${unit ? ` ${unit}` : ""}`
    }
    case "ALGO_TRACE": {
      const { cells } = payload as AlgoTracePayload
      const { values } = submission as AlgoTraceSubmission
      return cells
        .map((cell) => `${cell.label} : ${values[cell.id] ?? "—"}`)
        .join("\n")
    }
    case "PETRI_ENABLED_TRANSITIONS":
      return (
        (
          submission as PetriEnabledTransitionsSubmission
        ).selectedTransitionIds.join(", ") || "Aucune"
      )
    case "PETRI_FIRE_SEQUENCE":
      return describeMarking(
        (submission as PetriFireSequenceSubmission).marking
      )
    case "PETRI_MATRIX":
      return describeMatrix((submission as PetriMatrixSubmission).matrix)
    case "PETRI_PROPERTY":
      return labels(
        (payload as PetriPropertyPayload).properties,
        (submission as McqSubmission).selected
      )
    case "PETRI_INVARIANT":
      return labels(
        (payload as PetriInvariantPayload).vectors,
        (submission as McqSubmission).selected
      )
    case "PETRI_REACHABILITY":
      return labels(
        (payload as PetriReachabilityPayload).options,
        (submission as McqSubmission).selected
      )
    case "CODE_WRITE":
    case "CODE_FIX":
      return (submission as CodeSubmission).code
    case "SQL_DDL":
      return (submission as SqlDdlSubmission).ddl
    case "PLSQL_BLOCK":
    case "PLSQL_TRIGGER":
    case "PLSQL_PROCEDURE":
      return (submission as PlsqlProcSubmission).code
    case "TRACE_EXECUTION":
      return describeTrace((submission as TraceSubmission).output)
    case "RUBRIC_OPEN":
      return (submission as RubricSubmission).text
    case "CHART_READ": {
      const { candle, price, selected } = submission as ChartReadSubmission
      return describeChartAnswer(
        payload as ChartReadPayload,
        candle,
        price,
        selected
      )
    }
    case "TRADE_PLAN":
      return describePlan((submission as TradePlanSubmission).values)
  }
}
