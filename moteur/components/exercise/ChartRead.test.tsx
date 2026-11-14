import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { ChartRead } from "./ChartRead"

afterEach(cleanup)

const candles = [
  { o: 10, h: 11, l: 9.5, c: 10.5 },
  { o: 10.5, h: 12, l: 10.2, c: 11.8 },
]

describe("ChartRead", () => {
  it("mode candle : sélectionne une bougie au clic", () => {
    const onChange = vi.fn()
    render(
      <ChartRead
        payload={{ mode: "candle", candles }}
        submission={null}
        onChange={onChange}
        disabled={false}
      />
    )
    fireEvent.click(screen.getByTestId("candle-2"))
    expect(onChange).toHaveBeenCalledWith({ candle: 2 })
  })

  it("mode candle : indique la bougie sélectionnée", () => {
    render(
      <ChartRead
        payload={{ mode: "candle", candles }}
        submission={{ candle: 1 }}
        onChange={vi.fn()}
        disabled={false}
      />
    )
    expect(screen.getByText("Bougie sélectionnée : n°1")).toBeInTheDocument()
  })

  it("mode price : accepte un prix saisi avec virgule", () => {
    const onChange = vi.fn()
    render(
      <ChartRead
        payload={{ mode: "price", candles }}
        submission={null}
        onChange={onChange}
        disabled={false}
      />
    )
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "11,5" } })
    expect(onChange).toHaveBeenCalledWith({ price: 11.5 })
  })

  it("mode choice : affiche les lectures proposées", () => {
    const onChange = vi.fn()
    render(
      <ChartRead
        payload={{
          mode: "choice",
          candles,
          options: [
            { id: "a", label: "Tendance haussière" },
            { id: "b", label: "Tendance baissière" },
          ],
        }}
        submission={null}
        onChange={onChange}
        disabled={false}
      />
    )
    fireEvent.click(screen.getByText("Tendance haussière"))
    expect(onChange).toHaveBeenCalledWith({ selected: "a" })
  })
})
