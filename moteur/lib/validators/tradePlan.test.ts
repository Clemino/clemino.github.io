import { describe, expect, it } from "vitest"
import { validateTradePlan } from "./tradePlan"
import type { TradePlanPayload, TradePlanSolution } from "./types"

// Capital 10 000 €, risque max 1 % = 100 €, R/R min 2.
const payload: TradePlanPayload = {
  capital: 10000,
  currency: "€",
  direction: "long",
  maxRiskPct: 1,
  minRR: 2,
}
const solution: TradePlanSolution = {
  reference: { entry: 50, stop: 48, target: 54, size: 50 },
}
const sub = (entry: string, stop: string, target: string, size: string) => ({
  values: { entry, stop, target, size },
})

describe("validateTradePlan", () => {
  it("valide un plan correct", () => {
    const r = validateTradePlan(
      payload,
      solution,
      sub("50", "48", "54", "50"),
      ""
    )
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
    expect(r.feedback.every((c) => c.ok)).toBe(true)
  })

  it("accepte la virgule décimale", () => {
    expect(
      validateTradePlan(
        payload,
        solution,
        sub("50,5", "48,5", "54,5", "50"),
        ""
      ).passed
    ).toBe(true)
  })

  it("refuse un champ manquant ou non numérique", () => {
    const r = validateTradePlan(
      payload,
      solution,
      sub("50", "", "54", "50"),
      ""
    )
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })

  it("détecte un stop du mauvais côté (long)", () => {
    const r = validateTradePlan(
      payload,
      solution,
      sub("50", "52", "54", "50"),
      ""
    )
    expect(r.passed).toBe(false)
    expect(r.feedback.find((c) => c.criterion.startsWith("Stop"))?.ok).toBe(
      false
    )
  })

  it("détecte un stop du mauvais côté (short)", () => {
    const short = { ...payload, direction: "short" as const }
    expect(
      validateTradePlan(short, solution, sub("50", "52", "46", "50"), "").passed
    ).toBe(true)
    expect(
      validateTradePlan(short, solution, sub("50", "48", "46", "50"), "").passed
    ).toBe(false)
  })

  it("détecte un risque supérieur au maximum et donne des points partiels", () => {
    // 100 actions × 2 € = 200 € > 100 €
    const r = validateTradePlan(
      payload,
      solution,
      sub("50", "48", "54", "100"),
      ""
    )
    expect(r.passed).toBe(false)
    expect(r.feedback.find((c) => c.criterion.startsWith("Risque"))?.ok).toBe(
      false
    )
    expect(r.score).toBeGreaterThan(0)
    expect(r.score).toBeLessThan(1)
  })

  it("détecte un ratio risque/rendement insuffisant", () => {
    const r = validateTradePlan(
      payload,
      solution,
      sub("50", "48", "52", "50"),
      ""
    )
    expect(r.feedback.find((c) => c.criterion.startsWith("Ratio"))?.ok).toBe(
      false
    )
  })

  it("détecte une taille trop faible par rapport au risque autorisé", () => {
    const r = validateTradePlan(
      payload,
      solution,
      sub("50", "48", "54", "20"),
      ""
    )
    expect(r.feedback.find((c) => c.criterion.startsWith("Taille"))?.ok).toBe(
      false
    )
    expect(r.feedback.find((c) => c.criterion.startsWith("Risque"))?.ok).toBe(
      true
    )
  })

  it("tolère l'arrondi à l'unité inférieure de la taille", () => {
    // 100 / 1.5 = 66.67 → 66 actions
    expect(
      validateTradePlan(payload, solution, sub("50", "48.5", "53", "66"), "")
        .passed
    ).toBe(true)
  })

  it("vérifie les contraintes du scénario quand elles existent", () => {
    const constrained = {
      ...solution,
      entryRange: [50, 51] as [number, number],
      stopRange: [47.5, 48.5] as [number, number],
    }
    expect(
      validateTradePlan(payload, constrained, sub("50", "48", "54", "50"), "")
        .passed
    ).toBe(true)
    const r = validateTradePlan(
      payload,
      constrained,
      sub("45", "43", "55", "50"),
      ""
    )
    expect(r.feedback.find((c) => c.criterion.startsWith("Entrée"))?.ok).toBe(
      false
    )
    expect(
      r.feedback.find((c) => c.criterion.startsWith("Stop placé"))?.ok
    ).toBe(false)
  })
})
