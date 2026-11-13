import { describe, expect, it } from "vitest"
import { validateFigureInterpret } from "./figureInterpret"
import type {
  FigureInterpretPayload,
  FigureInterpretSolution,
  FigureInterpretSubmission,
} from "./types"

// ---------------------------------------------------------------------------
// FigureSpec de test : training-curve + confusion-matrix
// ---------------------------------------------------------------------------
const trainingCurveFigure: FigureInterpretPayload["figure"] = {
  kind: "training-curve",
  series: [
    {
      label: "perte entraînement",
      points: [
        { x: 1, y: 0.9 },
        { x: 2, y: 0.6 },
        { x: 3, y: 0.35 },
      ],
      tone: "accent",
    },
    {
      label: "perte validation",
      points: [
        { x: 1, y: 0.95 },
        { x: 2, y: 0.7 },
        { x: 3, y: 0.5 },
      ],
      tone: "warning",
    },
  ],
  xLabel: "Époque",
  yLabel: "Perte",
}

const confusionMatrixFigure: FigureInterpretPayload["figure"] = {
  kind: "confusion-matrix",
  classes: ["Chat", "Chien"],
  matrix: [
    [40, 10],
    [5, 45],
  ],
  caption: "Matrice de confusion — modèle chat/chien",
}

// ---------------------------------------------------------------------------
// Cas 1 — toutes les sous-questions correctes (score 1, passed = true)
//          Utilise une training-curve comme figure
// ---------------------------------------------------------------------------
describe("validateFigureInterpret — toutes correctes (training-curve)", () => {
  it("score 1 et passed = true quand toutes les réponses sont justes", () => {
    const payload: FigureInterpretPayload = {
      figure: trainingCurveFigure,
      caption: "Courbe d'apprentissage sur 3 époques",
      subQuestions: [
        {
          id: "q1",
          type: "MCQ_SINGLE",
          prompt: "Après 3 époques, quelle perte est la plus élevée ?",
          weight: 1,
          payload: {
            options: [
              { id: "a", label: "Perte entraînement" },
              { id: "b", label: "Perte validation" },
            ],
          },
        },
        {
          id: "q2",
          type: "NUMERIC",
          prompt: "Combien de séries sont affichées ?",
          weight: 1,
          payload: {},
        },
      ],
    }
    const solution: FigureInterpretSolution = {
      subSolutions: [
        { id: "q1", solution: { correct: ["b"] } },
        { id: "q2", solution: { value: 2 } },
      ],
    }
    const submission: FigureInterpretSubmission = {
      answers: {
        q1: { selected: ["b"] },
        q2: { value: "2" },
      },
    }
    const r = validateFigureInterpret(payload, solution, submission, "explication")
    expect(r.passed).toBe(true)
    expect(r.score).toBeCloseTo(1)
  })
})

// ---------------------------------------------------------------------------
// Cas 2 — partiellement correctes (score fractionnaire, passed = false)
//          Utilise une training-curve comme figure
// ---------------------------------------------------------------------------
describe("validateFigureInterpret — partiellement correctes (training-curve)", () => {
  it("score fractionnaire et passed = false quand une réponse est fausse", () => {
    const payload: FigureInterpretPayload = {
      figure: trainingCurveFigure,
      subQuestions: [
        {
          id: "q1",
          type: "NUMERIC",
          prompt: "Quelle est la perte entraînement à l'époque 1 ?",
          weight: 1,
          payload: {},
        },
        {
          id: "q2",
          type: "MCQ_SINGLE",
          prompt: "Quel type de problème ceci illustre-t-il ?",
          weight: 2,
          payload: {
            options: [
              { id: "a", label: "Régression" },
              { id: "b", label: "Classification" },
            ],
          },
        },
      ],
    }
    const solution: FigureInterpretSolution = {
      subSolutions: [
        { id: "q1", solution: { value: 0.9 } },
        { id: "q2", solution: { correct: ["b"] } },
      ],
    }
    // q1 correct (score 1, weight 1), q2 incorrect (score 0, weight 2)
    // score pondéré = (1×1 + 0×2) / (1+2) = 1/3
    const submission: FigureInterpretSubmission = {
      answers: {
        q1: { value: "0.9" },
        q2: { selected: ["a"] },
      },
    }
    const r = validateFigureInterpret(payload, solution, submission, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBeCloseTo(1 / 3)
  })
})

// ---------------------------------------------------------------------------
// Cas 3 — mix de types de sous-questions (MCQ_SINGLE + TRUE_FALSE + NUMERIC)
//          Utilise une confusion-matrix comme figure
// ---------------------------------------------------------------------------
describe("validateFigureInterpret — mix de types (confusion-matrix)", () => {
  it("agrège correctement MCQ_SINGLE + TRUE_FALSE + NUMERIC", () => {
    const payload: FigureInterpretPayload = {
      figure: confusionMatrixFigure,
      subQuestions: [
        {
          id: "q1",
          type: "MCQ_SINGLE",
          prompt: "Combien de vrais positifs pour 'Chat' ?",
          weight: 1,
          payload: {
            options: [
              { id: "a", label: "40" },
              { id: "b", label: "10" },
              { id: "c", label: "5" },
            ],
          },
        },
        {
          id: "q2",
          type: "TRUE_FALSE",
          prompt: "Le modèle commet plus d'erreurs sur 'Chat' que sur 'Chien'.",
          weight: 1,
          payload: {},
        },
        {
          id: "q3",
          type: "NUMERIC",
          prompt: "Combien d'exemples au total dans la matrice ?",
          weight: 1,
          payload: {},
        },
      ],
    }
    const solution: FigureInterpretSolution = {
      subSolutions: [
        { id: "q1", solution: { correct: ["a"] } },
        { id: "q2", solution: { value: true } },
        { id: "q3", solution: { value: 100 } },
      ],
    }
    // q1 correct, q2 correct (true), q3 correct (100)
    const submission: FigureInterpretSubmission = {
      answers: {
        q1: { selected: ["a"] },
        q2: { value: true },
        q3: { value: "100" },
      },
    }
    const r = validateFigureInterpret(payload, solution, submission, "explication complète")
    expect(r.passed).toBe(true)
    expect(r.score).toBeCloseTo(1)
  })
})

// ---------------------------------------------------------------------------
// Cas 4 — réponse manquante → score 0 pour cette sous-question
//          Utilise une confusion-matrix comme figure
// ---------------------------------------------------------------------------
describe("validateFigureInterpret — réponse manquante (confusion-matrix)", () => {
  it("score 0 et passed = false quand une sous-question n'est pas répondue", () => {
    const payload: FigureInterpretPayload = {
      figure: confusionMatrixFigure,
      subQuestions: [
        {
          id: "q1",
          type: "NUMERIC",
          prompt: "Précision du modèle en pourcentage ?",
          weight: 1,
          payload: {},
        },
      ],
    }
    const solution: FigureInterpretSolution = {
      subSolutions: [{ id: "q1", solution: { value: 85 } }],
    }
    // answers vide => sous-question non répondue
    const submission: FigureInterpretSubmission = { answers: {} }
    const r = validateFigureInterpret(payload, solution, submission, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Cas 5 — submission null/undefined → score 0, passed = false
//          Utilise une training-curve comme figure
// ---------------------------------------------------------------------------
describe("validateFigureInterpret — submission nulle (training-curve)", () => {
  it("score 0 et passed = false quand submission est null", () => {
    const payload: FigureInterpretPayload = {
      figure: trainingCurveFigure,
      subQuestions: [
        {
          id: "q1",
          type: "MCQ_SINGLE",
          prompt: "Y a-t-il sur-apprentissage ?",
          weight: 1,
          payload: {
            options: [
              { id: "a", label: "Oui" },
              { id: "b", label: "Non" },
            ],
          },
        },
      ],
    }
    const solution: FigureInterpretSolution = {
      subSolutions: [{ id: "q1", solution: { correct: ["a"] } }],
    }
    const r = validateFigureInterpret(payload, solution, null, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Cas 6 — le validateur ignore le contenu de la figure
//          Même payload de sous-questions, figures différentes → mêmes scores
// ---------------------------------------------------------------------------
describe("validateFigureInterpret — le validateur ignore le contenu de la figure", () => {
  it("retourne le même score quelle que soit la FigureSpec utilisée", () => {
    const subQuestions: FigureInterpretPayload["subQuestions"] = [
      {
        id: "q1",
        type: "NUMERIC",
        prompt: "Valeur quelconque",
        weight: 1,
        payload: {},
      },
    ]
    const subSolutions: FigureInterpretSolution["subSolutions"] = [
      { id: "q1", solution: { value: 42 } },
    ]
    const submission: FigureInterpretSubmission = {
      answers: { q1: { value: "42" } },
    }

    const r1 = validateFigureInterpret(
      { figure: trainingCurveFigure, subQuestions },
      { subSolutions },
      submission,
      "",
    )
    const r2 = validateFigureInterpret(
      { figure: confusionMatrixFigure, subQuestions },
      { subSolutions },
      submission,
      "",
    )

    expect(r1.passed).toBe(true)
    expect(r2.passed).toBe(true)
    expect(r1.score).toBeCloseTo(r2.score)
  })
})

// ---------------------------------------------------------------------------
// Cas 7 — agrégation pondérée (poids différents)
//          Utilise une confusion-matrix comme figure
// ---------------------------------------------------------------------------
describe("validateFigureInterpret — agrégation pondérée (confusion-matrix)", () => {
  it("calcule correctement le score avec des poids 2 vs 1", () => {
    const payload: FigureInterpretPayload = {
      figure: confusionMatrixFigure,
      subQuestions: [
        {
          id: "a",
          type: "MCQ_SINGLE",
          prompt: "Question A (poids 2)",
          weight: 2,
          payload: {
            options: [{ id: "x", label: "X" }],
          },
        },
        {
          id: "b",
          type: "MCQ_SINGLE",
          prompt: "Question B (poids 1)",
          weight: 1,
          payload: {
            options: [{ id: "y", label: "Y" }],
          },
        },
      ],
    }
    const solution: FigureInterpretSolution = {
      subSolutions: [
        { id: "a", solution: { correct: ["x"] } },
        { id: "b", solution: { correct: ["y"] } },
      ],
    }
    // a correcte (score 1, weight 2), b incorrecte (score 0, weight 1)
    // score = (1×2 + 0×1) / (2+1) = 2/3
    const submission: FigureInterpretSubmission = {
      answers: {
        a: { selected: ["x"] },
        b: { selected: [] },
      },
    }
    const r = validateFigureInterpret(payload, solution, submission, "")
    expect(r.passed).toBe(false)
    expect(r.score).toBeCloseTo(2 / 3)
  })
})

// ---------------------------------------------------------------------------
// Cas 8 — prefixes Q1. / Q2. dans le feedback
//          Utilise une training-curve comme figure
// ---------------------------------------------------------------------------
describe("validateFigureInterpret — préfixes Q1. / Q2. dans le feedback", () => {
  it("chaque critère est préfixé par Q1. ou Q2. selon son ordre", () => {
    const payload: FigureInterpretPayload = {
      figure: trainingCurveFigure,
      subQuestions: [
        {
          id: "q1",
          type: "NUMERIC",
          prompt: "Époque de départ ?",
          weight: 1,
          payload: {},
        },
        {
          id: "q2",
          type: "MCQ_SINGLE",
          prompt: "Meilleure métrique ?",
          weight: 1,
          payload: {
            options: [{ id: "a", label: "Précision" }],
          },
        },
      ],
    }
    const solution: FigureInterpretSolution = {
      subSolutions: [
        { id: "q1", solution: { value: 1 } },
        { id: "q2", solution: { correct: ["a"] } },
      ],
    }
    const submission: FigureInterpretSubmission = {
      answers: {
        q1: { value: "1" },
        q2: { selected: ["a"] },
      },
    }
    const r = validateFigureInterpret(payload, solution, submission, "")
    const criteria = r.feedback.map((c) => c.criterion)
    expect(criteria.some((c) => c.startsWith("Q1."))).toBe(true)
    expect(criteria.some((c) => c.startsWith("Q2."))).toBe(true)
  })
})
