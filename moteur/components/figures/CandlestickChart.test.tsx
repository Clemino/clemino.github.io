import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { CandlestickChart } from "./CandlestickChart"

afterEach(cleanup)

const candles = [
  { o: 10, h: 11, l: 9.5, c: 10.5, v: 100 },
  { o: 10.5, h: 12, l: 10.2, c: 11.8, v: 200 },
  { o: 11.8, h: 12.1, l: 10.9, c: 11, v: 150 },
]

describe("CandlestickChart", () => {
  it("dessine une bougie par donnée OHLC", () => {
    render(<CandlestickChart candles={candles} />)
    expect(screen.getByRole("img", { name: "Graphique en chandeliers" })).toBeInTheDocument()
    expect(screen.getByTestId("candle-1")).toBeInTheDocument()
    expect(screen.getByTestId("candle-3")).toBeInTheDocument()
  })

  it("affiche la légende des surcouches et le libellé des niveaux", () => {
    render(
      <CandlestickChart
        candles={candles}
        overlays={[{ label: "MM 2", values: [null, 10.8, 11.4] }]}
        levels={[{ price: 12, label: "résistance" }]}
      />,
    )
    expect(screen.getByText("MM 2")).toBeInTheDocument()
    expect(screen.getByText("résistance")).toBeInTheDocument()
  })

  it("renvoie le numéro de la bougie cliquée en mode candle", () => {
    const onPick = vi.fn()
    render(<CandlestickChart candles={candles} pick={{ mode: "candle", selected: null, onPick }} />)
    fireEvent.click(screen.getByTestId("candle-2"))
    expect(onPick).toHaveBeenCalledWith(2)
  })

  it("ignore les clics quand il est désactivé", () => {
    const onPick = vi.fn()
    render(<CandlestickChart candles={candles} pick={{ mode: "candle", selected: null, onPick, disabled: true }} />)
    fireEvent.click(screen.getByTestId("candle-2"))
    expect(onPick).not.toHaveBeenCalled()
  })

  it("expose une zone cliquable de prix en mode price", () => {
    render(<CandlestickChart candles={candles} pick={{ mode: "price", selected: 11.5, onPick: vi.fn() }} />)
    expect(screen.getByTestId("price-area")).toBeInTheDocument()
    expect(screen.getByText("11.5")).toBeInTheDocument()
  })
})
