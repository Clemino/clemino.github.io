import { normalize, numericMatch } from "./normalize"
import type {
  AlgoTracePayload,
  AlgoTraceSolution,
  AlgoTraceSubmission,
  ValidationResult,
} from "./types"

export function validateAlgoTrace(
  payload: AlgoTracePayload,
  solution: AlgoTraceSolution,
  submission: AlgoTraceSubmission,
  explanation: string
): ValidationResult {
  const caseSensitive = solution.caseSensitive ?? false
  const stripAccents = solution.stripAccents ?? true
  const values = submission?.values ?? {}

  let okCount = 0

  const feedback = solution.cells.map((cellSolution) => {
    // Find the matching payload cell for its label and kind
    const payloadCell = payload.cells.find((c) => c.id === cellSolution.id)
    const label = payloadCell?.label ?? cellSolution.id
    const rawInput = values[cellSolution.id] ?? ""

    // Determine if this is a numeric comparison:
    // - payload cell has kind === "number", OR
    // - solution's expected value is a number
    const isNumeric = payloadCell?.kind === "number" || typeof cellSolution.expected === "number"

    let ok = false

    if (isNumeric) {
      // Parse student input: trim whitespace, replace decimal comma with dot
      const cleaned = rawInput.trim().replace(/,/g, ".")
      const parsed = Number(cleaned)

      if (cleaned !== "" && !isNaN(parsed)) {
        const toleranceOpts = { absTol: cellSolution.absTol, relTol: cellSolution.relTol }
        const primaryTarget =
          typeof cellSolution.expected === "number"
            ? cellSolution.expected
            : Number(cellSolution.expected)

        // Build list of numeric targets: primary + any accepted numeric alternates
        const acceptedNums = (cellSolution.accepted ?? [])
          .map((v) => Number(v.trim().replace(/,/g, ".")))
          .filter((n) => !isNaN(n))

        const allTargets = [primaryTarget, ...acceptedNums]
        ok = allTargets.some((t) => numericMatch(parsed, t, toleranceOpts))
      }
      // Non-numeric or empty input => ok stays false
    } else {
      // Text comparison via normalize()
      const normOpts = { caseSensitive, stripAccents }
      const normInput = normalize(rawInput, normOpts)
      const normExpected = normalize(String(cellSolution.expected), normOpts)

      if (normInput === normExpected) {
        ok = true
      } else if (cellSolution.accepted && cellSolution.accepted.length > 0) {
        ok = cellSolution.accepted.some(
          (a) => normalize(rawInput, normOpts) === normalize(a, normOpts)
        )
      }
    }

    if (ok) okCount += 1

    return {
      ok,
      criterion: label,
      detail: ok ? undefined : `attendu: ${cellSolution.expected}`,
    }
  })

  const total = solution.cells.length
  const score = total > 0 ? okCount / total : 0
  const passed = okCount === total && total > 0

  // Readable canonical solution: one "label = expected" line per cell
  const canonicalSolution = solution.cells
    .map((cellSolution) => {
      const payloadCell = payload.cells.find((c) => c.id === cellSolution.id)
      const label = payloadCell?.label ?? cellSolution.id
      return `${label} = ${cellSolution.expected}`
    })
    .join("\n")

  return {
    passed,
    score,
    feedback,
    reveal: { canonicalSolution, explanation },
  }
}
