"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnySubmission, SubQuestion } from "@/lib/validators/types"
import { FillBlanks } from "./FillBlanks"
import { McqQuestion } from "./McqQuestion"
import { NumericInput } from "./NumericInput"
import { PredictOutput } from "./PredictOutput"
import { TrueFalse } from "./TrueFalse"

type Props = {
  subQuestion: SubQuestion
  answer: AnySubmission | undefined
  onChange: (v: AnySubmission) => void
  disabled: boolean
}

type Sub = Record<string, any>
type Pay = Record<string, any>

/**
 * Renders the appropriate primitive input component for a single sub-question.
 * Restricted to the 6 SubQuestionType primitive types — mirrors ExerciseRenderer
 * prop wiring so T1.5 (FIGURE_INTERPRET) can reuse it without modification.
 */
export function SubQuestionRenderer({ subQuestion, answer, onChange, disabled }: Props) {
  const sub = answer as Sub | undefined
  const pay = subQuestion.payload as Pay | null

  switch (subQuestion.type) {
    case "MCQ_SINGLE":
      return (
        <McqQuestion
          mode="single"
          payload={pay as any}
          value={(sub?.selected as string[]) ?? []}
          onChange={(v) => onChange({ selected: v } as AnySubmission)}
          disabled={disabled}
        />
      )
    case "MCQ_MULTI":
      return (
        <McqQuestion
          mode="multi"
          payload={pay as any}
          value={(sub?.selected as string[]) ?? []}
          onChange={(v) => onChange({ selected: v } as AnySubmission)}
          disabled={disabled}
        />
      )
    case "TRUE_FALSE":
      return (
        <TrueFalse
          value={(sub?.value as boolean | null) ?? null}
          onChange={(v) => onChange({ value: v } as AnySubmission)}
          disabled={disabled}
        />
      )
    case "FILL_BLANK":
      return (
        <FillBlanks
          payload={pay as any}
          values={(sub?.values as Record<string, string>) ?? {}}
          onChange={(v) => onChange({ values: v } as AnySubmission)}
          disabled={disabled}
        />
      )
    case "NUMERIC":
      return (
        <NumericInput
          payload={pay as any}
          value={(sub?.value as string) ?? ""}
          onChange={(v) => onChange({ value: v } as AnySubmission)}
          disabled={disabled}
        />
      )
    case "PREDICT_OUTPUT":
      return (
        <PredictOutput
          payload={pay as any}
          output={(sub?.output as string) ?? ""}
          onChange={(v) => onChange({ output: v } as AnySubmission)}
          disabled={disabled}
        />
      )
    default: {
      const exhaustive: never = subQuestion.type
      return (
        <div className="text-sm text-[var(--error)]">
          {"Type de sous-question non supporté : "}{String(exhaustive)}
        </div>
      )
    }
  }
}
