"use client"

import { useState } from "react"
import type { AnySubmission, FigureInterpretPayload, FigureInterpretSubmission } from "@/lib/validators/types"
import { FigureView } from "@/components/figures/FigureView"
import { PromptRenderer } from "./PromptRenderer"
import { SubQuestionRenderer } from "./SubQuestionRenderer"

export function FigureInterpret({
  payload,
  submission,
  onChange,
  disabled,
}: {
  payload: FigureInterpretPayload
  submission: FigureInterpretSubmission | null
  onChange: (s: FigureInterpretSubmission) => void
  disabled: boolean
}) {
  // Manage answers record locally; merge with parent via onChange
  const [answers, setAnswers] = useState<Record<string, AnySubmission>>(
    submission?.answers ?? {},
  )

  const updateAnswer = (id: string, value: AnySubmission) => {
    const next = { ...answers, [id]: value }
    setAnswers(next)
    onChange({ answers: next })
  }

  return (
    <div className="space-y-6">
      {/* Read-only figure display */}
      <div>
        <FigureView spec={payload.figure} />
        {payload.caption && (
          <p className="mt-2 text-xs text-[var(--fg-3)] italic">{payload.caption}</p>
        )}
      </div>

      {/* Sub-questions */}
      <div className="space-y-6">
        {payload.subQuestions.map((subQ, i) => (
          <div
            key={subQ.id}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-4 space-y-3"
          >
            <div className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-[10px] text-[var(--fg-3)] mt-0.5">
                Q{i + 1}.
              </span>
              <div className="text-[14px] leading-relaxed text-[var(--fg-0)]">
                <PromptRenderer source={subQ.prompt} />
              </div>
            </div>
            <SubQuestionRenderer
              subQuestion={subQ}
              answer={answers[subQ.id]}
              onChange={(v) => updateAnswer(subQ.id, v)}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
