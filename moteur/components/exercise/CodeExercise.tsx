"use client"

import { useState } from "react"
import { EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CODE_CHECKS } from "@/lib/validators/code"
import type {
  CodePayload,
  CodeSolution,
  CodeSubmission,
} from "@/lib/validators/types"
import { CodeBlock } from "./CodeBlock"
import { CodeEditorBox } from "./CodeEditorBox"

export function CodeExercise({
  payload,
  solution,
  submission,
  onChange,
  disabled,
}: {
  payload: CodePayload
  solution: CodeSolution
  submission: CodeSubmission | null
  onChange: (s: CodeSubmission) => void
  disabled: boolean
}) {
  const [code, setCode] = useState(
    submission?.code ?? payload.starterCode ?? ""
  )
  // The reference stays hidden until the student has made an attempt.
  const revealed = submission !== null
  const checked = submission?.checked ?? []
  const tests = payload.tests.filter((t) => !t.hidden)

  const toggle = (id: string) =>
    onChange({
      code,
      checked: checked.includes(id)
        ? checked.filter((c) => c !== id)
        : [...checked, id],
    })

  return (
    <div className="space-y-5">
      <CodeEditorBox
        value={code}
        onChange={setCode}
        disabled={disabled}
        readOnly={revealed}
      />

      {tests.length > 0 && (
        <div className="space-y-2">
          <div className="mono-label">Tests à vérifier</div>
          {tests.map((test) => (
            <div
              key={test.name}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-3 font-mono text-xs"
            >
              <div className="text-[var(--fg-2)]">{test.name}</div>
              {test.stdin && (
                <pre className="mt-1 whitespace-pre-wrap text-[var(--fg-1)]">{`entrée : ${test.stdin}`}</pre>
              )}
              <pre className="mt-1 whitespace-pre-wrap text-[var(--fg-0)]">{`sortie : ${test.expectedStdout}`}</pre>
            </div>
          ))}
        </div>
      )}

      {!revealed && (
        <Button
          variant="outline"
          onClick={() => onChange({ code, checked: [] })}
        >
          <EyeIcon className="size-4" />
          Voir la solution et m&apos;évaluer
        </Button>
      )}

      {revealed && (
        <>
          <div className="space-y-2">
            <div className="mono-label">Solution de référence</div>
            <CodeBlock code={solution.referenceCode} />
          </div>

          <fieldset className="space-y-2" disabled={disabled}>
            <legend className="mono-label mb-2">
              Compile ton code chez toi, puis coche ce qui est vrai
            </legend>
            {CODE_CHECKS.map((c) => (
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
