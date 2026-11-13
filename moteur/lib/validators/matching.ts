import type {
  MatchingPayload,
  MatchingSolution,
  MatchingSubmission,
  ValidationResult,
} from "./types"

export function validateMatching(
  payload: MatchingPayload,
  solution: MatchingSolution,
  submission: MatchingSubmission,
  explanation: string
): ValidationResult {
  const expected = solution.pairs ?? {}
  const submitted = submission.pairs ?? {}
  const leftIds = Object.keys(expected)

  let okCount = 0
  const feedback = leftIds.map((leftId) => {
    const expectedRight = expected[leftId]
    const submittedRight = submitted[leftId]
    const ok = submittedRight === expectedRight
    if (ok) okCount += 1
    const leftLabel = payload.left.find((l) => l.id === leftId)?.label ?? leftId
    const expectedLabel = payload.right.find((r) => r.id === expectedRight)?.label ?? expectedRight
    const submittedLabel = payload.right.find((r) => r.id === submittedRight)?.label ?? submittedRight ?? "—"
    return {
      ok,
      criterion: `« ${leftLabel} »`,
      detail: ok ? `↔ ${expectedLabel}` : `Attendu ↔ ${expectedLabel}, reçu ↔ ${submittedLabel}`,
    }
  })

  const passed = okCount === leftIds.length
  const score = leftIds.length ? okCount / leftIds.length : 0

  return {
    passed,
    score,
    feedback,
    reveal: {
      canonicalSolution: leftIds
        .map((leftId) => {
          const leftLabel = payload.left.find((l) => l.id === leftId)?.label ?? leftId
          const rightLabel =
            payload.right.find((r) => r.id === expected[leftId])?.label ?? expected[leftId]
          return `${leftLabel} ↔ ${rightLabel}`
        })
        .join("\n"),
      explanation,
    },
  }
}
