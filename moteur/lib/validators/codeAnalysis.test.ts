import { describe, expect, it } from "vitest"
import { validateCodeAnalysis } from "./codeAnalysis"
import type {
  CodeAnalysisPayload,
  CodeAnalysisSolution,
  CodeAnalysisSubmission,
} from "./types"

// ---------------------------------------------------------------------------
// Données de base
// ---------------------------------------------------------------------------
const baseCode = `def relu(x):
    return max(0, x)`

const payloadNumericMcq: CodeAnalysisPayload = {
  code: baseCode,
  language: "python",
  subQuestions: [
    {
      id: "q1",
      type: "NUMERIC",
      prompt: "Quelle est la valeur de relu(-3) ?",
      weight: 1,
      payload: {},
    },
    {
      id: "q2",
      type: "MCQ_SINGLE",
      prompt: "Quel type renvoie relu(5) ?",
      weight: 2,
      payload: {
        options: [
          { id: "a", label: "int" },
          { id: "b", label: "str" },
          { id: "c", label: "float" },
        ],
      },
    },
  ],
}

const solutionNumericMcq: CodeAnalysisSolution = {
  subSolutions: [
    { id: "q1", solution: { value: 0 } },
    { id: "q2", solution: { correct: ["a"] } },
  ],
}

// ---------------------------------------------------------------------------
// Cas 1 — toutes les sous-questions correctes (score 1, passed = true)
// ---------------------------------------------------------------------------
describe("validateCodeAnalysis — toutes correctes", () => {
  it("score 1 et passed = true quand toutes les réponses sont justes", () => {
    const submission: CodeAnalysisSubmission = {
      answers: {
        q1: { value: "0" },
        q2: { selected: ["a"] },
      },
    }
    const r = validateCodeAnalysis(
      payloadNumericMcq,
      solutionNumericMcq,
      submission,
      "explication"
    )
    expect(r.passed).toBe(true)
    expect(r.score).toBeCloseTo(1)
  })
})

// ---------------------------------------------------------------------------
// Cas 2 — partiellement correctes (score fractionnaire, passed = false)
// ---------------------------------------------------------------------------
describe("validateCodeAnalysis — partiellement correctes", () => {
  it("score fractionnaire et passed = false quand une réponse est fausse", () => {
    const submission: CodeAnalysisSubmission = {
      answers: {
        q1: { value: "0" }, // correct (score 1, weight 1)
        q2: { selected: ["b"] }, // incorrect (score 0, weight 2)
      },
    }
    // score pondéré = (1×1 + 0×2) / (1+2) = 1/3
    const r = validateCodeAnalysis(
      payloadNumericMcq,
      solutionNumericMcq,
      submission,
      ""
    )
    expect(r.passed).toBe(false)
    expect(r.score).toBeCloseTo(1 / 3)
  })
})

// ---------------------------------------------------------------------------
// Cas 3 — agrégation pondérée (poids différents)
// ---------------------------------------------------------------------------
describe("validateCodeAnalysis — agrégation pondérée", () => {
  it("calcule correctement le score avec des poids différents (2 vs 1)", () => {
    const payload: CodeAnalysisPayload = {
      code: baseCode,
      language: "python",
      subQuestions: [
        {
          id: "a",
          type: "MCQ_SINGLE",
          prompt: "Question A (poids 2)",
          weight: 2,
          payload: { options: [{ id: "x", label: "X" }] },
        },
        {
          id: "b",
          type: "MCQ_SINGLE",
          prompt: "Question B (poids 1)",
          weight: 1,
          payload: { options: [{ id: "y", label: "Y" }] },
        },
      ],
    }
    const solution: CodeAnalysisSolution = {
      subSolutions: [
        { id: "a", solution: { correct: ["x"] } },
        { id: "b", solution: { correct: ["y"] } },
      ],
    }
    // a correcte (score 1, weight 2), b incorrecte (score 0, weight 1)
    const submission: CodeAnalysisSubmission = {
      answers: {
        a: { selected: ["x"] },
        b: { selected: [] },
      },
    }
    // score = (1×2 + 0×1) / (2+1) = 2/3
    const r = validateCodeAnalysis(payload, solution, submission, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBeCloseTo(2 / 3)
  })
})

// ---------------------------------------------------------------------------
// Cas 4 — mix NUMERIC + MCQ_SINGLE, pondération par défaut (weight = 1)
// ---------------------------------------------------------------------------
describe("validateCodeAnalysis — mix NUMERIC + MCQ_SINGLE, weight par défaut", () => {
  it("score 0.5 avec poids 1 par défaut quand une sous-question sur deux est correcte", () => {
    const payload: CodeAnalysisPayload = {
      code: baseCode,
      language: "python",
      // weight absent => défaut 1
      subQuestions: [
        {
          id: "n1",
          type: "NUMERIC",
          prompt: "Valeur de relu(7) ?",
          payload: {},
        },
        {
          id: "m1",
          type: "MCQ_SINGLE",
          prompt: "relu(0) vaut ?",
          payload: {
            options: [
              { id: "z", label: "0" },
              { id: "w", label: "1" },
            ],
          },
        },
      ],
    }
    const solution: CodeAnalysisSolution = {
      subSolutions: [
        { id: "n1", solution: { value: 7 } },
        { id: "m1", solution: { correct: ["z"] } },
      ],
    }
    const submission: CodeAnalysisSubmission = {
      answers: {
        n1: { value: "7" }, // correct
        m1: { selected: ["w"] }, // incorrect
      },
    }
    const r = validateCodeAnalysis(payload, solution, submission, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBeCloseTo(0.5)
  })
})

// ---------------------------------------------------------------------------
// Cas 5 — réponse manquante → score 0 pour cette sous-question
// ---------------------------------------------------------------------------
describe("validateCodeAnalysis — réponse manquante", () => {
  it("score 0 pour une sous-question sans réponse de l'étudiant", () => {
    const payload: CodeAnalysisPayload = {
      code: baseCode,
      language: "python",
      subQuestions: [
        {
          id: "q1",
          type: "NUMERIC",
          prompt: "Valeur de relu(-1) ?",
          payload: {},
        },
      ],
    }
    const solution: CodeAnalysisSolution = {
      subSolutions: [{ id: "q1", solution: { value: 0 } }],
    }
    // answers vide => réponse manquante
    const submission: CodeAnalysisSubmission = { answers: {} }
    const r = validateCodeAnalysis(payload, solution, submission, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Cas 6 — préfixe Q1. / Q2. dans le feedback
// ---------------------------------------------------------------------------
describe("validateCodeAnalysis — préfixes Q1. / Q2. dans le feedback", () => {
  it("chaque critère est préfixé par Q1. ou Q2. selon son ordre", () => {
    const submission: CodeAnalysisSubmission = {
      answers: {
        q1: { value: "0" },
        q2: { selected: ["a"] },
      },
    }
    const r = validateCodeAnalysis(
      payloadNumericMcq,
      solutionNumericMcq,
      submission,
      ""
    )
    const criteria = r.feedback.map((c) => c.criterion)
    expect(criteria.some((c) => c.startsWith("Q1."))).toBe(true)
    expect(criteria.some((c) => c.startsWith("Q2."))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Cas 7 — passed = true seulement si TOUTES les sous-questions sont passées
// ---------------------------------------------------------------------------
describe("validateCodeAnalysis — passed = true uniquement si tout est correct", () => {
  it("passed = false même si score élevé mais une sous-question échoue", () => {
    const payload: CodeAnalysisPayload = {
      code: baseCode,
      language: "python",
      subQuestions: [
        { id: "q1", type: "NUMERIC", prompt: "?", weight: 99, payload: {} },
        { id: "q2", type: "NUMERIC", prompt: "?", weight: 1, payload: {} },
      ],
    }
    const solution: CodeAnalysisSolution = {
      subSolutions: [
        { id: "q1", solution: { value: 42 } },
        { id: "q2", solution: { value: 10 } },
      ],
    }
    const submission: CodeAnalysisSubmission = {
      answers: {
        q1: { value: "42" }, // correct, poids 99
        q2: { value: "999" }, // incorrect, poids 1
      },
    }
    const r = validateCodeAnalysis(payload, solution, submission, "")
    expect(r.passed).toBe(false)
    // score élevé mais pas 1 : 99/100
    expect(r.score).toBeCloseTo(99 / 100)
  })
})

// ---------------------------------------------------------------------------
// Cas 8 — régression : TRUE_FALSE non répondu avec bonne réponse = false
//          L'ancienne implémentation fabriquait { value: false } et obtenait
//          spurieusement score 1. La nouvelle doit donner score 0, passed false.
// ---------------------------------------------------------------------------
describe("validateCodeAnalysis — régression TRUE_FALSE non répondu (bonne réponse = false)", () => {
  it("score 0 et passed = false pour une TRUE_FALSE non répondue dont la solution est false", () => {
    const payload: CodeAnalysisPayload = {
      code: baseCode,
      language: "python",
      subQuestions: [
        {
          id: "tf1",
          type: "TRUE_FALSE",
          prompt: "relu renvoie toujours un entier ?",
          weight: 1,
          payload: {},
        },
      ],
    }
    const solution: CodeAnalysisSolution = {
      // La bonne réponse est false
      subSolutions: [{ id: "tf1", solution: { value: false } }],
    }
    // L'étudiant n'a pas répondu
    const submission: CodeAnalysisSubmission = { answers: {} }
    const r = validateCodeAnalysis(payload, solution, submission, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Cas 9 — garde invalide : type de sous-question non reconnu
//          Ne doit pas planter, doit retourner passed = false, score 0,
//          et un critère mentionnant le type invalide.
// ---------------------------------------------------------------------------
describe("validateCodeAnalysis — type de sous-question invalide", () => {
  it("ne plante pas, passed = false, score 0, critère mentionant le type non supporté", () => {
    const payload: CodeAnalysisPayload = {
      code: baseCode,
      language: "python",
      subQuestions: [
        {
          id: "bad1",
          type: "ORDERING" as never,
          prompt: "Type invalide",
          weight: 1,
          payload: {},
        },
      ],
    }
    const solution: CodeAnalysisSolution = {
      subSolutions: [],
    }
    const submission: CodeAnalysisSubmission = { answers: {} }
    const r = validateCodeAnalysis(payload, solution, submission, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
    const hasInvalidTypeCriterion = r.feedback.some(
      (c) => !c.ok && /invalide|ORDERING/i.test(c.criterion)
    )
    expect(hasInvalidTypeCriterion).toBe(true)
  })
})
