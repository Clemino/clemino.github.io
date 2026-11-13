import { setsEqual } from "./normalize"
import type {
  McqPayload,
  McqSolution,
  McqSubmission,
  TrueFalsePayload,
  TrueFalseSolution,
  TrueFalseSubmission,
  ValidationResult,
} from "./types"

const optionLabel = (payload: McqPayload, id: string | undefined) =>
  payload.options?.find((o) => o.id === id)?.label ?? id

export function validateMcqSingle(
  payload: McqPayload,
  solution: McqSolution,
  submission: McqSubmission,
  explanation: string
): ValidationResult {
  const correct = solution.correct ?? []
  const selected = submission.selected ?? []
  const passed = selected.length === 1 && correct.length === 1 && selected[0] === correct[0]
  return {
    passed,
    score: passed ? 1 : 0,
    feedback: [
      {
        ok: passed,
        criterion: "Réponse exacte",
        detail: passed
          ? "Bonne réponse."
          : `Attendu : « ${optionLabel(payload, correct[0]) ?? "?"} ». Tu as choisi : « ${optionLabel(payload, selected[0]) ?? "rien"} ».`,
      },
    ],
    reveal: { canonicalSolution: correct.map((id) => optionLabel(payload, id)).join(" ; "), explanation },
  }
}

export function validateMcqMulti(
  payload: McqPayload,
  solution: McqSolution,
  submission: McqSubmission,
  explanation: string
): ValidationResult {
  const correct = solution.correct ?? []
  const selected = submission.selected ?? []
  const exact = setsEqual(correct, selected)

  if (exact) {
    return {
      passed: true,
      score: 1,
      feedback: [{ ok: true, criterion: "Sélection exacte", detail: "Toutes les bonnes réponses, aucune erreur." }],
      reveal: { canonicalSolution: correct.map((id) => optionLabel(payload, id)).join(" ; "), explanation },
    }
  }

  // Partial credit: count true positives - false positives, normalized
  const correctSet = new Set(correct)
  const tp = selected.filter((id) => correctSet.has(id)).length
  const fp = selected.filter((id) => !correctSet.has(id)).length
  const fn = correct.filter((id) => !selected.includes(id)).length
  const raw = (tp - fp) / Math.max(1, correct.length)
  const score = Math.max(0, Math.min(1, raw))

  return {
    passed: false,
    score,
    feedback: [
      { ok: tp > 0, criterion: `${tp} bonne(s) réponse(s) sélectionnée(s)` },
      { ok: fp === 0, criterion: `${fp} mauvaise(s) réponse(s) sélectionnée(s)`, detail: fp > 0 ? "Décochez les options incorrectes." : undefined },
      { ok: fn === 0, criterion: `${fn} bonne(s) réponse(s) manquée(s)`, detail: fn > 0 ? "Il manque des cases à cocher." : undefined },
    ],
    reveal: { canonicalSolution: correct.map((id) => optionLabel(payload, id)).join(" ; "), explanation },
  }
}

export function validateTrueFalse(
  _payload: TrueFalsePayload,
  solution: TrueFalseSolution,
  submission: TrueFalseSubmission,
  explanation: string
): ValidationResult {
  const passed = submission.value === solution.value
  return {
    passed,
    score: passed ? 1 : 0,
    feedback: [
      {
        ok: passed,
        criterion: "Réponse Vrai/Faux",
        detail: passed ? "Correct." : `Attendu : ${solution.value ? "Vrai" : "Faux"}.`,
      },
    ],
    reveal: {
      canonicalSolution: solution.value ? "Vrai" : "Faux",
      explanation,
    },
  }
}
