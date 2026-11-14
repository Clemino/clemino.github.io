"use client"

import { useState } from "react"
import type {
  AnySubmission,
  CaseStudyPayload,
  CaseStudySubmission,
} from "@/lib/validators/types"
import { PromptRenderer } from "./PromptRenderer"
import { SubQuestionRenderer } from "./SubQuestionRenderer"

export function CaseStudy({
  payload,
  submission,
  onChange,
  disabled,
}: {
  payload: CaseStudyPayload
  submission: CaseStudySubmission | null
  onChange: (s: CaseStudySubmission) => void
  disabled: boolean
}) {
  const [answers, setAnswers] = useState<Record<string, AnySubmission>>(
    submission?.answers ?? {}
  )

  const updateAnswer = (id: string, value: AnySubmission) => {
    const next = { ...answers, [id]: value }
    setAnswers(next)
    onChange({ answers: next })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-md border-l-2 border-[var(--accent)] bg-[var(--bg-1)] px-4 py-3 text-[14px] text-[var(--fg-1)]">
        <PromptRenderer source={payload.scenario} />
      </div>

      <div className="space-y-6">
        {payload.subQuestions.map((subQ, i) => (
          <div
            key={subQ.id}
            className="space-y-3 rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-4"
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[var(--fg-3)]">
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
