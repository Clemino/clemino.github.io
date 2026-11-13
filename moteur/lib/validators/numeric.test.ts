import { describe, expect, it } from "vitest"
import { validateNumeric } from "./numeric"

describe("validateNumeric", () => {
  it("réussit pour une valeur exacte", () => {
    const r = validateNumeric({}, { value: 42 }, { value: "42" }, "explication")
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
  })

  it("réussit pour une valeur dans la tolérance absolue", () => {
    const r = validateNumeric({}, { value: 100, absTol: 5 }, { value: "103" }, "")
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
  })

  it("échoue pour une valeur hors tolérance absolue", () => {
    const r = validateNumeric({}, { value: 100, absTol: 5 }, { value: "110" }, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })

  it("réussit pour une valeur dans la tolérance relative", () => {
    // |215 - 200| = 15 ≤ relTol(0.1) × |200| = 20 => dans la tolérance relative => réussit
    const r = validateNumeric({}, { value: 200, relTol: 0.1 }, { value: "215" }, "")
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
  })

  it("échoue pour une valeur hors tolérance relative", () => {
    const r = validateNumeric({}, { value: 200, relTol: 0.1 }, { value: "225" }, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })

  it("accepte une virgule décimale comme séparateur", () => {
    const r = validateNumeric({}, { value: 3.14 }, { value: "3,14" }, "")
    expect(r.passed).toBe(true)
  })

  it("échoue pour une entrée non numérique", () => {
    const r = validateNumeric({}, { value: 42 }, { value: "abc" }, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
    expect(r.feedback[0].criterion).toBe("Réponse non numérique")
  })

  it("échoue pour une entrée vide", () => {
    const r = validateNumeric({}, { value: 42 }, { value: "" }, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
    expect(r.feedback[0].criterion).toBe("Réponse non numérique")
  })

  it("réussit pour une valeur dans acceptedValues", () => {
    const r = validateNumeric(
      {},
      { value: 10, acceptedValues: [5, 15, 20] },
      { value: "15" },
      ""
    )
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
  })

  it("inclut l'unité dans canonicalSolution quand elle est définie", () => {
    const r = validateNumeric(
      { unit: "paramètres" },
      { value: 896 },
      { value: "896" },
      "explication"
    )
    expect(r.reveal.canonicalSolution).toBe("896 paramètres")
  })

  it("n'inclut pas d'unité dans canonicalSolution quand elle est absente", () => {
    const r = validateNumeric({}, { value: 0.75 }, { value: "0.75" }, "")
    expect(r.reveal.canonicalSolution).toBe("0.75")
  })

  it("les retours sont positifs en cas de succès", () => {
    const r = validateNumeric({}, { value: 7 }, { value: "7" }, "")
    expect(r.feedback[0].ok).toBe(true)
  })

  it("les retours indiquent la valeur attendue en cas d'échec", () => {
    const r = validateNumeric({}, { value: 7 }, { value: "99" }, "")
    expect(r.feedback[0].ok).toBe(false)
    expect(r.feedback[0].criterion).toMatch(/Valeur attendue/)
  })

  // Fix 3a: target = 0 avec relTol — seul absTol peut valider (relTol·|0| = 0)
  it("cible 0 avec relTol : seul absTol détermine la tolérance", () => {
    // valeur dans absTol => réussit
    const pass = validateNumeric({}, { value: 0, relTol: 0.1, absTol: 0.5 }, { value: "0.3" }, "")
    expect(pass.passed).toBe(true)
    // valeur hors absTol => échoue (relTol ne peut pas compenser car relTol·|0| = 0)
    const fail = validateNumeric({}, { value: 0, relTol: 0.1, absTol: 0.5 }, { value: "1.0" }, "")
    expect(fail.passed).toBe(false)
  })

  // Fix 3b: espaces en début/fin sont ignorés après trim
  it("espaces en début et fin sont correctement ignorés", () => {
    const r = validateNumeric({}, { value: 3.5 }, { value: "  3.5  " }, "")
    expect(r.passed).toBe(true)
  })

  // Fix 3c: notation scientifique "1e3" est interprétée comme 1000
  it("notation scientifique est interprétée correctement", () => {
    const r = validateNumeric({}, { value: 1000 }, { value: "1e3" }, "")
    expect(r.passed).toBe(true)
  })
})
