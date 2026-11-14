import { describe, expect, it } from "vitest"
import { validateChartRead } from "./chartRead"
import type { ChartReadPayload } from "./types"

const candles = [
  { o: 10, h: 11, l: 9.5, c: 10.5 },
  { o: 10.5, h: 12, l: 10.2, c: 11.8 },
  { o: 11.8, h: 12.1, l: 10.9, c: 11 },
]
const base = { candles }

describe("validateChartRead — mode candle", () => {
  const payload: ChartReadPayload = { ...base, mode: "candle" }

  it("accepte la bonne bougie", () => {
    const r = validateChartRead(payload, { candles: [2] }, { candle: 2 }, "")
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
  })

  it("refuse une autre bougie sans tolérance", () => {
    expect(
      validateChartRead(payload, { candles: [2] }, { candle: 3 }, "").passed
    ).toBe(false)
  })

  it("applique la tolérance en nombre de bougies", () => {
    expect(
      validateChartRead(
        payload,
        { candles: [2], candleTol: 1 },
        { candle: 3 },
        ""
      ).passed
    ).toBe(true)
  })

  it("accepte l'une des bougies acceptées", () => {
    expect(
      validateChartRead(payload, { candles: [1, 3] }, { candle: 3 }, "").passed
    ).toBe(true)
  })

  it("refuse une absence de réponse", () => {
    const r = validateChartRead(payload, { candles: [2] }, {}, "")
    expect(r.passed).toBe(false)
    expect(r.feedback[0].criterion).toMatch(/Aucune bougie/)
  })
})

describe("validateChartRead — mode price", () => {
  const payload: ChartReadPayload = { ...base, mode: "price" }

  it("accepte un prix dans la tolérance absolue", () => {
    expect(
      validateChartRead(
        payload,
        { price: 12, priceTol: 0.2 },
        { price: 11.85 },
        ""
      ).passed
    ).toBe(true)
  })

  it("refuse un prix hors tolérance", () => {
    expect(
      validateChartRead(
        payload,
        { price: 12, priceTol: 0.2 },
        { price: 11.5 },
        ""
      ).passed
    ).toBe(false)
  })

  it("utilise 1 % du prix comme tolérance par défaut", () => {
    expect(
      validateChartRead(payload, { price: 100 }, { price: 100.9 }, "").passed
    ).toBe(true)
    expect(
      validateChartRead(payload, { price: 100 }, { price: 101.5 }, "").passed
    ).toBe(false)
  })
})

describe("validateChartRead — mode choice", () => {
  const payload: ChartReadPayload = {
    ...base,
    mode: "choice",
    options: [
      { id: "a", label: "Haussière" },
      { id: "b", label: "Baissière" },
    ],
  }

  it("accepte la bonne lecture", () => {
    expect(
      validateChartRead(payload, { correct: "a" }, { selected: "a" }, "").passed
    ).toBe(true)
  })

  it("refuse une mauvaise lecture et révèle le libellé attendu", () => {
    const r = validateChartRead(
      payload,
      { correct: "a" },
      { selected: "b" },
      ""
    )
    expect(r.passed).toBe(false)
    expect(r.reveal.canonicalSolution).toBe("Haussière")
  })
})
