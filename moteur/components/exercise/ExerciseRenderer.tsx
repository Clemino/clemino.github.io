/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useSyncExternalStore } from "react"
import type { AnySubmission, CaseStudySubmission, ChartReadSubmission, CodeAnalysisSubmission, CodeSolution, CodeSubmission, FigureInterpretSubmission, WritingSubmission } from "@/lib/validators/types"
import { AlgoTrace } from "./AlgoTrace"
import { CaseStudy } from "./CaseStudy"
import { ChartRead } from "./ChartRead"
import { CodeAnalysis } from "./CodeAnalysis"
import { CodeExercise } from "./CodeExercise"
import { FigureInterpret } from "./FigureInterpret"
import { FillBlanks } from "./FillBlanks"
import { MatchingPairs } from "./MatchingPairs"
import { McqQuestion } from "./McqQuestion"
import { NumericInput } from "./NumericInput"
import { OrderingList } from "./OrderingList"
import { PetriChoiceQuestion } from "./PetriChoiceQuestion"
import { PetriEnabledTransitions } from "./PetriEnabledTransitions"
import { PetriFireSequence } from "./PetriFireSequence"
import { PetriMatrixQuestion } from "./PetriMatrixQuestion"
import { PlsqlBlock } from "./PlsqlBlock"
import { PredictOutput } from "./PredictOutput"
import { RubricOpen } from "./RubricOpen"
import { SqlEditorBox } from "./SqlEditorBox"
import { TraceTable } from "./TraceTable"
import { TradePlan } from "./TradePlan"
import { TrueFalse } from "./TrueFalse"
import { WritingExercise } from "./WritingExercise"

export type ExerciseRendererProps = {
  type: string
  payload: unknown
  solution?: unknown
  submission: AnySubmission | null
  disabled: boolean
  onChange: (s: AnySubmission) => void
}

type Sub = Record<string, any>
type Pay = Record<string, any>

const subscribe = () => () => {}

export function ExerciseRenderer({ type, payload, solution, submission, disabled, onChange }: ExerciseRendererProps) {
  // Answers are shuffled in the browser, so they cannot be part of the prerendered HTML.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  if (!mounted) return null

  const sub = submission as Sub | null
  const pay = payload as Pay | null
  switch (type) {
    case "MCQ_SINGLE":
      return <McqQuestion mode="single" payload={pay as any} value={(sub?.selected as string[]) ?? []} onChange={(v) => onChange({ selected: v } as AnySubmission)} disabled={disabled} />
    case "MCQ_MULTI":
      return <McqQuestion mode="multi" payload={pay as any} value={(sub?.selected as string[]) ?? []} onChange={(v) => onChange({ selected: v } as AnySubmission)} disabled={disabled} />
    case "TRUE_FALSE":
      return <TrueFalse value={(sub?.value as boolean | null) ?? null} onChange={(v) => onChange({ value: v } as AnySubmission)} disabled={disabled} />
    case "FILL_BLANK":
      return <FillBlanks payload={pay as any} values={(sub?.values as Record<string, string>) ?? {}} onChange={(v) => onChange({ values: v } as AnySubmission)} disabled={disabled} />
    case "ORDERING":
      return <OrderingList payload={pay as any} order={(sub?.order as string[] | null) ?? null} onChange={(v) => onChange({ order: v } as AnySubmission)} disabled={disabled} />
    case "MATCHING":
      return <MatchingPairs payload={pay as any} pairs={(sub?.pairs as Record<string, string>) ?? {}} onChange={(v) => onChange({ pairs: v } as AnySubmission)} disabled={disabled} />
    case "CASE_STUDY":
      return <CaseStudy payload={pay as any} submission={submission as CaseStudySubmission | null} onChange={(v) => onChange(v as AnySubmission)} disabled={disabled} />
    case "WRITING":
      return <WritingExercise payload={pay as any} submission={submission as WritingSubmission | null} onChange={(v) => onChange(v as AnySubmission)} disabled={disabled} />
    case "PREDICT_OUTPUT":
      return <PredictOutput payload={pay as any} output={(sub?.output as string) ?? ""} onChange={(v) => onChange({ output: v } as AnySubmission)} disabled={disabled} />
    case "NUMERIC":
      return <NumericInput payload={pay as any} value={(sub?.value as string) ?? ""} onChange={(v) => onChange({ value: v } as AnySubmission)} disabled={disabled} />
    case "ALGO_TRACE":
      return <AlgoTrace payload={pay as any} values={(sub?.values as Record<string, string>) ?? {}} onChange={(v) => onChange({ values: v } as AnySubmission)} disabled={disabled} />
    case "CODE_ANALYSIS":
      return <CodeAnalysis payload={pay as any} submission={submission as CodeAnalysisSubmission | null} onChange={(v) => onChange(v as AnySubmission)} disabled={disabled} />
    case "FIGURE_INTERPRET":
      return <FigureInterpret payload={pay as any} submission={submission as FigureInterpretSubmission | null} onChange={(v) => onChange(v as AnySubmission)} disabled={disabled} />
    case "PETRI_ENABLED_TRANSITIONS":
      return <PetriEnabledTransitions payload={pay as any} selected={(sub?.selectedTransitionIds as string[]) ?? []} onChange={(v) => onChange({ selectedTransitionIds: v } as AnySubmission)} disabled={disabled} />
    case "PETRI_FIRE_SEQUENCE":
      return <PetriFireSequence payload={pay as any} marking={(sub?.marking as Record<string, number>) ?? {}} onChange={(v) => onChange({ marking: v } as AnySubmission)} disabled={disabled} />
    case "PETRI_MATRIX":
      return <PetriMatrixQuestion payload={pay as any} matrix={(sub?.matrix as Record<string, Record<string, number>>) ?? {}} onChange={(v) => onChange({ matrix: v } as AnySubmission)} disabled={disabled} />
    case "PETRI_PROPERTY":
    case "PETRI_INVARIANT":
      return <PetriChoiceQuestion payload={pay as any} mode="multi" selected={(sub?.selected as string[]) ?? []} onChange={(v) => onChange({ selected: v } as AnySubmission)} disabled={disabled} />
    case "PETRI_REACHABILITY":
      return <PetriChoiceQuestion payload={pay as any} mode="single" selected={(sub?.selected as string[]) ?? []} onChange={(v) => onChange({ selected: v } as AnySubmission)} disabled={disabled} />
    case "CODE_WRITE":
    case "CODE_FIX":
      return <CodeExercise payload={pay as any} solution={solution as CodeSolution} submission={submission as CodeSubmission | null} onChange={(v) => onChange(v as AnySubmission)} disabled={disabled} />
    case "CHART_READ":
      return <ChartRead payload={pay as any} submission={submission as ChartReadSubmission | null} onChange={(v) => onChange(v as AnySubmission)} disabled={disabled} />
    case "TRADE_PLAN":
      return <TradePlan payload={pay as any} values={(sub?.values as Record<string, string>) ?? {}} onChange={(v) => onChange({ values: v } as AnySubmission)} disabled={disabled} />
    case "SQL_DDL":
      return <SqlEditorBox value={(sub?.ddl as string) ?? ""} onChange={(v) => onChange({ ddl: v } as AnySubmission)} disabled={disabled} />
    case "PLSQL_BLOCK":
    case "PLSQL_TRIGGER":
    case "PLSQL_PROCEDURE":
      return <PlsqlBlock value={(sub?.code as string) ?? ""} onChange={(v) => onChange({ code: v } as AnySubmission)} disabled={disabled} />
    case "TRACE_EXECUTION":
      return <TraceTable payload={pay as any} output={(sub?.output as any) ?? ""} onChange={(v) => onChange({ output: v } as AnySubmission)} disabled={disabled} />
    case "RUBRIC_OPEN":
      return <RubricOpen payload={pay as any} text={(sub?.text as string) ?? ""} onChange={(v) => onChange({ text: v } as AnySubmission)} disabled={disabled} />
    default:
      return <div className="text-sm text-[var(--error)]">{"Type d'exercice non supporté : "}{type}</div>
  }
}
