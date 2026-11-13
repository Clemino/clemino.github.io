import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { NumericInput } from "./NumericInput"

afterEach(cleanup)

describe("NumericInput", () => {
  it("affiche le placeholder par défaut quand aucun n'est défini", () => {
    render(
      <NumericInput
        payload={{}}
        value=""
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByPlaceholderText("Entrez un nombre…")).toBeInTheDocument()
  })

  it("affiche le placeholder personnalisé défini dans le payload", () => {
    render(
      <NumericInput
        payload={{ placeholder: "ex: 42" }}
        value=""
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByPlaceholderText("ex: 42")).toBeInTheDocument()
  })

  it("affiche l'unité quand elle est fournie", () => {
    render(
      <NumericInput
        payload={{ unit: "km/h" }}
        value=""
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("km/h")).toBeInTheDocument()
  })

  it("affiche l'indice quand il est fourni", () => {
    render(
      <NumericInput
        payload={{ hint: "Pensez aux décimales" }}
        value=""
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByText("Pensez aux décimales")).toBeInTheDocument()
  })

  it("affiche la valeur actuelle dans l'input", () => {
    render(
      <NumericInput
        payload={{}}
        value="3.14"
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(screen.getByRole("textbox")).toHaveValue("3.14")
  })

  it("désactive l'input quand disabled est vrai", () => {
    render(
      <NumericInput
        payload={{}}
        value=""
        onChange={vi.fn()}
        disabled={true}
      />,
    )
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("a un aria-label incluant l'unité quand elle est définie", () => {
    render(
      <NumericInput
        payload={{ unit: "m/s" }}
        value=""
        onChange={vi.fn()}
        disabled={false}
      />,
    )
    expect(
      screen.getByRole("textbox", { name: /Réponse numérique \(m\/s\)/ }),
    ).toBeInTheDocument()
  })
})
