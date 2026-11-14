import { normalize } from "./normalize"
import type {
  TracePayload,
  TraceSolution,
  TraceSubmission,
  ValidationResult,
} from "./types"

function tableEqual(
  a: string[][],
  b: string[][]
): { ok: boolean; mismatchAt?: { row: number; col: number } } {
  if (a.length !== b.length) return { ok: false }
  for (let r = 0; r < a.length; r++) {
    if (a[r].length !== b[r].length)
      return { ok: false, mismatchAt: { row: r, col: 0 } }
    for (let c = 0; c < a[r].length; c++) {
      if (normalize(a[r][c]) !== normalize(b[r][c])) {
        return { ok: false, mismatchAt: { row: r, col: c } }
      }
    }
  }
  return { ok: true }
}

export function validateTrace(
  payload: TracePayload,
  solution: TraceSolution,
  submission: TraceSubmission,
  explanation: string
): ValidationResult {
  if (payload.format === "table") {
    const expected = solution.expectedOutput as string[][]
    const submitted = (submission.output as string[][]) ?? []
    const cmp = tableEqual(submitted, expected)
    return {
      passed: cmp.ok,
      score: cmp.ok ? 1 : 0,
      feedback: [
        {
          ok: cmp.ok,
          criterion: "Trace conforme",
          detail: cmp.ok
            ? "Toutes les cellules correspondent."
            : cmp.mismatchAt
              ? `Différence repérée ligne ${cmp.mismatchAt.row + 1}, colonne ${cmp.mismatchAt.col + 1}.`
              : "Dimensions différentes du résultat attendu.",
        },
      ],
      reveal: {
        canonicalSolution: expected.map((r) => r.join(" | ")).join("\n"),
        explanation,
      },
    }
  }

  const expected = normalize(solution.expectedOutput as string)
  const submitted = normalize((submission.output as string) ?? "")
  const ok = expected === submitted
  return {
    passed: ok,
    score: ok ? 1 : 0,
    feedback: [
      {
        ok,
        criterion: "Sortie attendue",
        detail: ok ? "Identique." : "Le contenu textuel diffère.",
      },
    ],
    reveal: {
      canonicalSolution: String(solution.expectedOutput),
      explanation,
    },
  }
}
