"use client"

import type { PredictOutputPayload } from "@/lib/validators/types"
import { CodeBlock } from "./CodeBlock"

export function PredictOutput({
  payload,
  output,
  onChange,
  disabled,
}: {
  payload: PredictOutputPayload
  output: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  return (
    <div className="space-y-3">
      <div>
        <div className="mono-label mb-1.5">Programme</div>
        <CodeBlock
          code={payload.program}
          language={payload.language}
          showLineNumbers
        />
      </div>
      <div>
        <div className="mono-label mb-1.5">Valeur ou sortie attendue</div>
        <textarea
          value={output}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={5}
          spellCheck={false}
          placeholder="Tape ici exactement ce que le programme affiche…"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-3 font-mono text-[13px] text-[var(--fg-0)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        />
      </div>
    </div>
  )
}
