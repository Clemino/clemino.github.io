import { describe, expect, it } from "vitest"
import { validateAlgoTrace } from "./algoTrace"

// Payload et solution de base réutilisables
const baseCells = [
  { id: "n1", label: "Nœud A" },
  { id: "n2", label: "Nœud B" },
  { id: "n3", label: "Nœud C" },
]

const baseSolution = {
  cells: [
    { id: "n1", expected: "ouvert" },
    { id: "n2", expected: "fermé" },
    { id: "n3", expected: "en attente" },
  ],
}

describe("validateAlgoTrace", () => {
  // --- Score 1, passed ---
  it("réussit avec toutes les cellules correctes (score 1, passed = true)", () => {
    const r = validateAlgoTrace(
      { cells: baseCells },
      baseSolution,
      { values: { n1: "ouvert", n2: "fermé", n3: "en attente" } },
      "explication"
    )
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
    expect(r.feedback.every((c) => c.ok)).toBe(true)
  })

  // --- Score partiel, not passed ---
  it("retourne un score partiel si certaines cellules sont incorrectes (passed = false)", () => {
    const r = validateAlgoTrace(
      { cells: baseCells },
      baseSolution,
      { values: { n1: "ouvert", n2: "FAUX", n3: "en attente" } },
      ""
    )
    expect(r.passed).toBe(false)
    // 2 sur 3 correctes (n2 est normalisée => "ferme" vs "ferme" => mais caseSensitive non, donc...
    // n2: "FAUX" normalisé => "faux" != "ferme" => incorrect
    // score = 2/3
    expect(r.score).toBeCloseTo(2 / 3)
    expect(r.feedback.find((c) => c.criterion === "Nœud B")?.ok).toBe(false)
    expect(r.feedback.find((c) => c.criterion === "Nœud A")?.ok).toBe(true)
  })

  // --- Aucune cellule correcte ---
  it("retourne un score de 0 si toutes les cellules sont incorrectes", () => {
    const r = validateAlgoTrace(
      { cells: baseCells },
      baseSolution,
      { values: { n1: "X", n2: "X", n3: "X" } },
      ""
    )
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })

  // --- Cellule numérique — absTol ---
  it("accepte une valeur numérique dans la tolérance absolue (absTol)", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "v1", label: "Valeur minimax", kind: "number" as const }] },
      { cells: [{ id: "v1", expected: 10, absTol: 1 }] },
      { values: { v1: "10.5" } },
      ""
    )
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
  })

  // --- Cellule numérique — relTol ---
  it("accepte une valeur numérique dans la tolérance relative (relTol)", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "v1", label: "g(n)", kind: "number" as const }] },
      { cells: [{ id: "v1", expected: 100, relTol: 0.1 }] },
      { values: { v1: "108" } },
      ""
    )
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
  })

  // --- Cellule numérique hors tolérance ---
  it("rejette une valeur numérique hors tolérance", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "v1", label: "g(n)", kind: "number" as const }] },
      { cells: [{ id: "v1", expected: 100, absTol: 2 }] },
      { values: { v1: "110" } },
      ""
    )
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })

  // --- Entrée non numérique pour une cellule numérique ---
  it("rejette une entrée non numérique pour une cellule kind='number'", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "v1", label: "Score", kind: "number" as const }] },
      { cells: [{ id: "v1", expected: 42 }] },
      { values: { v1: "abc" } },
      ""
    )
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
    expect(r.feedback[0].ok).toBe(false)
  })

  // --- Cellule numérique détectée via le type de expected (number) ---
  it("détecte la comparaison numérique via le type de expected (number), sans kind='number'", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "v1", label: "Heuristique" }] },
      { cells: [{ id: "v1", expected: 7 }] },
      { values: { v1: "7" } },
      ""
    )
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
  })

  // --- Cellule numérique avec accepted[] ---
  it("accepte les valeurs numériques alternatives via accepted[]", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "v1", label: "Valeur", kind: "number" as const }] },
      { cells: [{ id: "v1", expected: 5, accepted: ["3", "7"] }] },
      { values: { v1: "3" } },
      ""
    )
    expect(r.passed).toBe(true)
    expect(r.score).toBe(1)
  })

  // --- Cellule texte via normalize() ---
  it("compare le texte via normalize() (insensible à la casse par défaut)", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "s1", label: "État" }] },
      { cells: [{ id: "s1", expected: "Ouvert" }] },
      { values: { s1: "OUVERT" } },
      ""
    )
    expect(r.passed).toBe(true)
  })

  // --- Accents strippés par défaut ---
  it("accepte les variantes accentuées par défaut (stripAccents=true)", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "s1", label: "Résultat" }] },
      { cells: [{ id: "s1", expected: "fermé" }] },
      { values: { s1: "ferme" } },
      ""
    )
    expect(r.passed).toBe(true)
  })

  // --- caseSensitive=true ---
  it("respecte caseSensitive=true au niveau solution", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "s1", label: "Label" }] },
      { cells: [{ id: "s1", expected: "Ouvert" }], caseSensitive: true },
      { values: { s1: "ouvert" } },
      ""
    )
    expect(r.passed).toBe(false)
  })

  // --- stripAccents=false ---
  it("respecte stripAccents=false au niveau solution", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "s1", label: "Label" }] },
      { cells: [{ id: "s1", expected: "fermé" }], stripAccents: false },
      { values: { s1: "ferme" } },
      ""
    )
    expect(r.passed).toBe(false)
  })

  // --- Cellule texte avec accepted[] ---
  it("accepte les variantes textuelles alternatives via accepted[]", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "s1", label: "File OPEN" }] },
      { cells: [{ id: "s1", expected: "A", accepted: ["B", "C"] }] },
      { values: { s1: "B" } },
      ""
    )
    expect(r.passed).toBe(true)
  })

  // --- Valeur manquante (pas de saisie) ---
  it("traite une cellule sans saisie comme incorrecte", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "s1", label: "Liste" }] },
      { cells: [{ id: "s1", expected: "A, B, C" }] },
      { values: {} },
      ""
    )
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })

  // --- submission null / absent ---
  it("gère une submission null/valeurs absentes sans erreur", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "s1", label: "Nœud" }] },
      { cells: [{ id: "s1", expected: "X" }] },
      // @ts-expect-error test de robustesse intentionnel
      { values: null },
      ""
    )
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })

  // --- Feedback contient "attendu:" pour une mauvaise cellule ---
  it("inclut 'attendu:' dans le détail du feedback pour une cellule incorrecte", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "n1", label: "Nœud A" }] },
      { cells: [{ id: "n1", expected: "ouvert" }] },
      { values: { n1: "fermé" } },
      ""
    )
    const criterion = r.feedback.find((c) => c.criterion === "Nœud A")
    expect(criterion?.ok).toBe(false)
    expect(criterion?.detail).toMatch(/attendu/i)
  })

  // --- reveal.canonicalSolution lisible ---
  it("inclut une canonicalSolution lisible (label = expected)", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "n1", label: "Nœud A" }, { id: "n2", label: "Nœud B" }] },
      { cells: [{ id: "n1", expected: "ouvert" }, { id: "n2", expected: 5 }] },
      { values: { n1: "ouvert", n2: "5" } },
      "explication test"
    )
    expect(r.reveal.canonicalSolution).toContain("Nœud A = ouvert")
    expect(r.reveal.canonicalSolution).toContain("Nœud B = 5")
    expect(r.reveal.explanation).toBe("explication test")
  })

  // --- Virgule décimale ---
  it("accepte une virgule comme séparateur décimal pour les cellules numériques", () => {
    const r = validateAlgoTrace(
      { cells: [{ id: "v1", label: "Coût", kind: "number" as const }] },
      { cells: [{ id: "v1", expected: 3.14 }] },
      { values: { v1: "3,14" } },
      ""
    )
    expect(r.passed).toBe(true)
  })
})
