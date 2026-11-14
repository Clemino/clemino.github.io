import type {
  ChartReadPayload,
  ChartReadSolution,
  ChartReadSubmission,
  ValidationResult,
} from "./types"

const DEFAULT_PRICE_REL_TOL = 0.01

export function validateChartRead(
  payload: ChartReadPayload,
  solution: ChartReadSolution,
  submission: ChartReadSubmission,
  explanation: string
): ValidationResult {
  const fail = (
    criterion: string,
    canonicalSolution: string,
    detail?: string
  ): ValidationResult => ({
    passed: false,
    score: 0,
    feedback: [{ ok: false, criterion, detail }],
    reveal: { canonicalSolution, explanation },
  })
  const pass = (
    criterion: string,
    canonicalSolution: string
  ): ValidationResult => ({
    passed: true,
    score: 1,
    feedback: [{ ok: true, criterion }],
    reveal: { canonicalSolution, explanation },
  })

  switch (payload.mode) {
    case "candle": {
      const expected = solution.candles ?? []
      const tol = solution.candleTol ?? 0
      const canonical = `Bougie n°${expected.join(" ou n°")}`
      const picked = submission?.candle
      if (picked === undefined || picked === null)
        return fail("Aucune bougie sélectionnée", canonical)
      return expected.some((n) => Math.abs(picked - n) <= tol)
        ? pass("Bonne bougie", canonical)
        : fail(
            `Bougie attendue : n°${expected.join(" ou n°")}`,
            canonical,
            `Tu as sélectionné la bougie n°${picked}.`
          )
    }
    case "price": {
      const expected = solution.price ?? 0
      const tol =
        solution.priceTol ?? Math.abs(expected) * DEFAULT_PRICE_REL_TOL
      const canonical = `${expected} (± ${Math.round(tol * 100) / 100})`
      const picked = submission?.price
      if (picked === undefined || picked === null || Number.isNaN(picked))
        return fail("Aucun prix sélectionné", canonical)
      return Math.abs(picked - expected) <= tol + 1e-9
        ? pass("Niveau de prix correct", canonical)
        : fail(
            `Niveau attendu : ${canonical}`,
            canonical,
            `Tu as indiqué ${picked}.`
          )
    }
    case "choice": {
      const canonical =
        payload.options?.find((o) => o.id === solution.correct)?.label ??
        String(solution.correct)
      if (!submission?.selected)
        return fail("Aucune lecture choisie", canonical)
      return submission.selected === solution.correct
        ? pass("Bonne lecture du graphique", canonical)
        : fail(`Lecture attendue : ${canonical}`, canonical)
    }
  }
}
