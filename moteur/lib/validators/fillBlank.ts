import { normalize } from "./normalize"
import type {
  FillBlankPayload,
  FillBlankSolution,
  FillBlankSubmission,
  ValidationResult,
} from "./types"

export function validateFillBlank(
  payload: FillBlankPayload,
  solution: FillBlankSolution,
  submission: FillBlankSubmission,
  explanation: string
): ValidationResult {
  const caseSensitive = solution.caseSensitive ?? false
  const stripAccents = solution.stripAccents ?? true
  const slots = payload.slots ?? []
  const values = submission.values ?? {}
  const answers = solution.answers ?? {}

  let okCount = 0
  const feedback = slots.map((slot) => {
    const userValue = values[slot.id] ?? ""
    const expected = answers[slot.id]
    const expectedList = Array.isArray(expected)
      ? expected
      : expected
        ? [expected]
        : []
    const matches = expectedList.some(
      (e) =>
        normalize(userValue, { caseSensitive, stripAccents }) ===
        normalize(e, { caseSensitive, stripAccents })
    )
    if (matches) okCount += 1
    return {
      ok: matches,
      criterion: `Trou « ${slot.id} »`,
      detail: matches
        ? `Correct (${userValue}).`
        : `Attendu : ${expectedList.join(" | ")}. Reçu : « ${userValue || "rien"} ».`,
    }
  })

  const score = slots.length ? okCount / slots.length : 0
  const passed = okCount === slots.length

  const canonical = slots
    .map((s) => {
      const e = answers[s.id]
      const arr = Array.isArray(e) ? e : [e ?? ""]
      return `${s.id}=${arr[0]}`
    })
    .join(", ")

  return {
    passed,
    score,
    feedback,
    reveal: { canonicalSolution: canonical, explanation },
  }
}
