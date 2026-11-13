"use client"

import { useState } from "react"
import { EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WritingPayload, WritingSubmission } from "@/lib/validators/types"
import { PromptRenderer } from "./PromptRenderer"

export function WritingExercise({
  payload,
  submission,
  onChange,
  disabled,
}: {
  payload: WritingPayload
  submission: WritingSubmission | null
  onChange: (s: WritingSubmission) => void
  disabled: boolean
}) {
  const [text, setText] = useState(submission?.text ?? "")
  // The model answer stays hidden until the student has made an attempt.
  const revealed = submission !== null
  const checked = submission?.checked ?? []
  const words = text.trim() ? text.trim().split(/\s+/).length : 0

  const toggle = (id: string) =>
    onChange({
      text,
      checked: checked.includes(id) ? checked.filter((c) => c !== id) : [...checked, id],
    })

  return (
    <div className="space-y-5">
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          readOnly={revealed}
          rows={14}
          aria-label="Ta copie"
          placeholder="Rédige ici, ou sur papier comme à l'examen, puis ouvre le corrigé."
          className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg-1)] p-3 text-[14px] leading-relaxed text-[var(--fg-0)] outline-none focus:border-[var(--accent)]"
        />
        <div className="mt-1 text-right font-mono text-[10px] text-[var(--fg-3)]">{words} mots</div>
      </div>

      {!revealed && (
        <Button variant="outline" onClick={() => onChange({ text, checked: [] })}>
          <EyeIcon className="size-4" />
          Voir le corrigé et m&apos;évaluer
        </Button>
      )}

      {revealed && (
        <>
          <div className="space-y-3 rounded-md border-l-2 border-[var(--accent)] bg-[var(--bg-1)] px-4 py-3 text-[14px] text-[var(--fg-1)]">
            <div className="mono-label">Corrigé type (non officiel)</div>
            <PromptRenderer source={payload.modelAnswer} />
          </div>

          <fieldset className="space-y-2" disabled={disabled}>
            <legend className="mono-label mb-2">Coche ce que ta copie contient vraiment</legend>
            {payload.rubric.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="mt-1 accent-[var(--accent)]"
                  checked={checked.includes(c.id)}
                  onChange={() => toggle(c.id)}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </fieldset>
        </>
      )}
    </div>
  )
}
