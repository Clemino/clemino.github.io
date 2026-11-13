/** One OHLC candle. `v` (volume) is optional. */
export type Candle = { o: number; h: number; l: number; c: number; v?: number }

/** A stretch of the series with its own trend (drift) and noise (volatility), both per candle. */
export type OhlcSegment = { count: number; drift?: number; volatility?: number }

export type OhlcSpec = {
  seed: number
  start: number
  segments: OhlcSegment[]
  /** Average volume per candle; omitted means no volume. */
  volume?: number
  decimals?: number
}

// Small deterministic PRNG so a given seed always yields the same chart.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function gaussian(rand: () => number): number {
  const u = Math.max(rand(), 1e-12)
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand())
}

/** Generates fictitious OHLC data — used to illustrate chart patterns without any market-data licence. */
export function generateOhlc(spec: OhlcSpec): Candle[] {
  const rand = mulberry32(spec.seed)
  const factor = 10 ** (spec.decimals ?? 2)
  const round = (x: number) => Math.round(x * factor) / factor
  const candles: Candle[] = []
  let prevClose = spec.start

  for (const seg of spec.segments) {
    const drift = seg.drift ?? 0
    const vol = seg.volatility ?? 0.01
    for (let i = 0; i < seg.count; i++) {
      const o = round(prevClose)
      const c = round(o * (1 + drift + vol * gaussian(rand)))
      const h = round(Math.max(o, c) * (1 + Math.abs(gaussian(rand)) * vol * 0.5))
      const l = round(Math.min(o, c) * (1 - Math.abs(gaussian(rand)) * vol * 0.5))
      const candle: Candle = { o, h, l, c }
      if (spec.volume) candle.v = Math.round(spec.volume * (0.5 + rand() + Math.abs(c - o) / (o * vol || 1) * 0.3))
      candles.push(candle)
      prevClose = c
    }
  }
  return candles
}
