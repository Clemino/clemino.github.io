/**
 * Prints fictitious OHLC candles as JSON, to paste into a CHART_READ / candlestick payload.
 * Usage: pnpm gen:ohlc '{"seed":7,"start":50,"segments":[{"count":20,"drift":0.01,"volatility":0.015}],"volume":10000}'
 */
import { generateOhlc, type OhlcSpec } from "../lib/ohlc"

const arg = process.argv[2]
if (!arg) {
  console.error("Usage: pnpm gen:ohlc '<OhlcSpec JSON>'")
  process.exit(1)
}
console.log(JSON.stringify(generateOhlc(JSON.parse(arg) as OhlcSpec)))
