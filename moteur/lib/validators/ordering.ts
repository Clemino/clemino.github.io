import type {
  OrderingPayload,
  OrderingSolution,
  OrderingSubmission,
  ValidationResult,
} from "./types"

export function validateOrdering(
  payload: OrderingPayload,
  solution: OrderingSolution,
  submission: OrderingSubmission,
  explanation: string
): ValidationResult {
  const expected = solution.order ?? []
  const submitted = submission.order ?? []
  const exact =
    submitted.length === expected.length &&
    submitted.every((id, i) => id === expected[i])

  if (exact) {
    return {
      passed: true,
      score: 1,
      feedback: [
        { ok: true, criterion: "Ordre exact", detail: "Séquence correcte." },
      ],
      reveal: {
        canonicalSolution: expected
          .map(
            (id, i) =>
              `${i + 1}. ${payload.items.find((it) => it.id === id)?.label ?? id}`
          )
          .join("\n"),
        explanation,
      },
    }
  }

  // Score: position-correctness ratio
  const okCount = submitted.filter((id, i) => id === expected[i]).length
  const score = expected.length ? okCount / expected.length : 0

  return {
    passed: false,
    score,
    feedback: [
      {
        ok: false,
        criterion: "Ordre exact",
        detail: `${okCount}/${expected.length} éléments à la bonne position.`,
      },
    ],
    reveal: {
      canonicalSolution: expected
        .map(
          (id, i) =>
            `${i + 1}. ${payload.items.find((it) => it.id === id)?.label ?? id}`
        )
        .join("\n"),
      explanation,
    },
  }
}
