import { describe, expect, it } from "vitest"
import { generateOhlc } from "./ohlc"

const spec = { seed: 42, start: 100, segments: [{ count: 20, drift: 0.01, volatility: 0.01 }] }

describe("generateOhlc", () => {
  it("est déterministe pour une même graine", () => {
    expect(generateOhlc(spec)).toEqual(generateOhlc(spec))
  })

  it("change avec la graine", () => {
    expect(generateOhlc({ ...spec, seed: 43 })).not.toEqual(generateOhlc(spec))
  })

  it("produit des bougies cohérentes (l <= o,c <= h) enchaînées sur la clôture précédente", () => {
    const candles = generateOhlc({ ...spec, segments: [{ count: 50, volatility: 0.03 }] })
    expect(candles).toHaveLength(50)
    candles.forEach((k, i) => {
      expect(k.l).toBeLessThanOrEqual(Math.min(k.o, k.c))
      expect(k.h).toBeGreaterThanOrEqual(Math.max(k.o, k.c))
      if (i > 0) expect(k.o).toBe(candles[i - 1].c)
    })
  })

  it("suit la tendance de chaque segment", () => {
    const candles = generateOhlc({ seed: 1, start: 100, segments: [{ count: 30, drift: 0.02, volatility: 0.005 }, { count: 30, drift: -0.02, volatility: 0.005 }] })
    expect(candles[29].c).toBeGreaterThan(candles[0].o)
    expect(candles[59].c).toBeLessThan(candles[29].c)
  })

  it("n'ajoute le volume que s'il est demandé", () => {
    expect(generateOhlc(spec)[0].v).toBeUndefined()
    expect(generateOhlc({ ...spec, volume: 1000 })[0].v).toBeGreaterThan(0)
  })
})
