import { containsWord } from "./normalize"
import type {
  RubricPayload,
  RubricSolution,
  RubricSubmission,
  ValidationCriterion,
  ValidationResult,
} from "./types"

export function validateRubric(
  payload: RubricPayload,
  solution: RubricSolution,
  submission: RubricSubmission,
  explanation: string
): ValidationResult {
  const text = submission.text ?? ""
  const trimmed = text.trim()

  if (!trimmed) {
    return {
      passed: false,
      score: 0,
      feedback: [{ ok: false, criterion: "Réponse vide" }],
      reveal: { canonicalSolution: solution.modelAnswer, explanation },
    }
  }

  const wordCount = trimmed.split(/\s+/).filter(Boolean).length
  const totalWeight = payload.rubric.reduce((sum, c) => sum + c.weight, 0)
  let earned = 0

  const feedback: ValidationCriterion[] = payload.rubric.map((criterion) => {
    const matched = criterion.keywords.filter((kw) =>
      containsWord(text, kw)
    ).length
    // Keywords are synonyms: a good answer uses one of them, not half of the list.
    const required = criterion.minMatches ?? 1
    const ratio = Math.min(1, matched / Math.max(1, required))
    const ok = ratio >= 1
    earned += ratio * criterion.weight
    return {
      ok,
      weight: criterion.weight,
      criterion: criterion.description,
      detail: ok
        ? `Mots-clés détectés : ${matched}/${criterion.keywords.length}.`
        : `${matched} mot(s)-clé(s) trouvé(s) sur ${required} requis. Pensez à : ${criterion.keywords.slice(0, 5).join(", ")}.`,
    }
  })

  if (payload.minWords && wordCount < payload.minWords) {
    feedback.unshift({
      ok: false,
      criterion: `Longueur minimale (${payload.minWords} mots)`,
      detail: `Réponse trop courte : ${wordCount} mots.`,
    })
  }

  const score = totalWeight > 0 ? earned / totalWeight : 0
  const passed = score >= 0.7

  return {
    passed,
    score,
    feedback,
    reveal: { canonicalSolution: solution.modelAnswer, explanation },
  }
}
