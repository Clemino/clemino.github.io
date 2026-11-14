import {
  enabledTransitions,
  incidenceMatrix,
  initialMarking,
  isPInvariant,
  isTInvariant,
  markingEquals,
  matrixEquals,
  postMatrix,
  preMatrix,
} from "@/lib/petri/core"
import type { Marking, PetriMatrix, PetriNet } from "@/lib/petri/types"
import { setsEqual } from "./normalize"
import type {
  PetriEnabledTransitionsPayload,
  PetriEnabledTransitionsSolution,
  PetriEnabledTransitionsSubmission,
  PetriFireSequencePayload,
  PetriFireSequenceSolution,
  PetriFireSequenceSubmission,
  PetriInvariantPayload,
  PetriInvariantSolution,
  PetriInvariantSubmission,
  PetriMatrixPayload,
  PetriMatrixSolution,
  PetriMatrixSubmission,
  PetriPropertyPayload,
  PetriPropertySolution,
  PetriPropertySubmission,
  PetriReachabilityPayload,
  PetriReachabilitySolution,
  PetriReachabilitySubmission,
  ValidationResult,
} from "./types"

export function validatePetriEnabledTransitions(
  payload: PetriEnabledTransitionsPayload,
  solution: PetriEnabledTransitionsSolution,
  submission: PetriEnabledTransitionsSubmission,
  explanation: string
): ValidationResult {
  const expected =
    solution.enabledTransitionIds ??
    enabledTransitions(asNet(payload), initialMarking(payload, payload.marking))
  const selected = submission.selectedTransitionIds ?? []
  const passed = setsEqual(expected, selected)
  const expectedSet = new Set(expected)
  const tp = selected.filter((id) => expectedSet.has(id)).length
  const fp = selected.filter((id) => !expectedSet.has(id)).length
  const score = passed
    ? 1
    : Math.max(0, Math.min(1, (tp - fp) / Math.max(1, expected.length)))

  return {
    passed,
    score,
    feedback: [
      {
        ok: tp === expected.length,
        criterion: `${tp}/${expected.length} transition(s) franchissable(s) trouvees`,
      },
      {
        ok: fp === 0,
        criterion: `${fp} transition(s) non franchissable(s) cochee(s)`,
      },
    ],
    reveal: { canonicalSolution: expected.join(", ") || "aucune", explanation },
  }
}

export function validatePetriFireSequence(
  payload: PetriFireSequencePayload,
  solution: PetriFireSequenceSolution,
  submission: PetriFireSequenceSubmission,
  explanation: string
): ValidationResult {
  const places = payload.places.map((p) => p.id)
  const expected = normalizeMarking(solution.finalMarking)
  const submitted = normalizeMarking(submission.marking ?? {})
  const okCount = places.filter(
    (placeId) =>
      Number(submitted[placeId] ?? 0) === Number(expected[placeId] ?? 0)
  ).length
  const passed = markingEquals(expected, submitted, places)
  const canonical = places
    .map((placeId) => `${placeId}=${expected[placeId] ?? 0}`)
    .join(", ")

  return {
    passed,
    score: places.length ? okCount / places.length : 0,
    feedback: [
      {
        ok: passed,
        criterion: "Marquage final",
        detail: passed
          ? "Marquage exact."
          : `${okCount}/${places.length} place(s) correcte(s).`,
      },
    ],
    reveal: { canonicalSolution: canonical, explanation },
  }
}

export function validatePetriMatrix(
  payload: PetriMatrixPayload,
  solution: PetriMatrixSolution,
  submission: PetriMatrixSubmission,
  explanation: string
): ValidationResult {
  const expected = solution.matrix ?? expectedMatrix(payload)
  const submitted = submission.matrix ?? {}
  const places = payload.places.map((p) => p.id)
  const transitions = payload.transitions.map((t) => t.id)
  let okCount = 0
  let total = 0

  const cells = payload.editableCells?.length
    ? payload.editableCells
    : places.flatMap((placeId) =>
        transitions.map((transitionId) => ({ placeId, transitionId }))
      )

  for (const cell of cells) {
    total += 1
    if (
      Number(submitted[cell.placeId]?.[cell.transitionId] ?? 0) ===
      Number(expected[cell.placeId]?.[cell.transitionId] ?? 0)
    ) {
      okCount += 1
    }
  }

  const passed =
    okCount === total &&
    matrixEquals(sliceMatrix(submitted, cells), sliceMatrix(expected, cells))
  return {
    passed,
    score: total ? okCount / total : 0,
    feedback: [
      {
        ok: passed,
        criterion: `Matrice ${payload.matrix}`,
        detail: passed
          ? "Toutes les cellules sont correctes."
          : `${okCount}/${total} cellule(s) correcte(s).`,
      },
    ],
    reveal: {
      canonicalSolution: matrixToText(expected, places, transitions),
      explanation,
    },
  }
}

export function validatePetriProperty(
  payload: PetriPropertyPayload,
  solution: PetriPropertySolution,
  submission: PetriPropertySubmission,
  explanation: string
): ValidationResult {
  const correct = solution.correct ?? []
  const selected = submission.selected ?? []
  const passed = setsEqual(correct, selected)
  const correctSet = new Set(correct)
  const tp = selected.filter((id) => correctSet.has(id)).length
  const fp = selected.filter((id) => !correctSet.has(id)).length
  const score = passed
    ? 1
    : Math.max(0, Math.min(1, (tp - fp) / Math.max(1, correct.length)))
  const labels = new Map(payload.properties.map((p) => [p.id, p.label]))
  return {
    passed,
    score,
    feedback: [
      {
        ok: tp === correct.length,
        criterion: `${tp}/${correct.length} propriete(s) correcte(s)`,
      },
      {
        ok: fp === 0,
        criterion: `${fp} propriete(s) incorrecte(s) selectionnee(s)`,
      },
    ],
    reveal: {
      canonicalSolution:
        correct.map((id) => labels.get(id) ?? id).join(", ") || "aucune",
      explanation,
    },
  }
}

export function validatePetriInvariant(
  payload: PetriInvariantPayload,
  solution: PetriInvariantSolution,
  submission: PetriInvariantSubmission,
  explanation: string
): ValidationResult {
  const expected =
    solution.correct ??
    payload.vectors
      .filter((v) =>
        payload.invariantType === "place"
          ? isPInvariant(payload, v.values)
          : isTInvariant(payload, v.values)
      )
      .map((v) => v.id)
  const selected = submission.selected ?? []
  const passed = setsEqual(expected, selected)
  const expectedSet = new Set(expected)
  const tp = selected.filter((id) => expectedSet.has(id)).length
  const fp = selected.filter((id) => !expectedSet.has(id)).length
  const score = passed
    ? 1
    : Math.max(0, Math.min(1, (tp - fp) / Math.max(1, expected.length)))
  const labels = new Map(payload.vectors.map((v) => [v.id, v.label]))
  return {
    passed,
    score,
    feedback: [
      {
        ok: tp === expected.length,
        criterion: `${tp}/${expected.length} invariant(s) valide(s) trouve(s)`,
      },
      { ok: fp === 0, criterion: `${fp} proposition(s) invalide(s) cochee(s)` },
    ],
    reveal: {
      canonicalSolution:
        expected.map((id) => labels.get(id) ?? id).join(", ") || "aucun",
      explanation,
    },
  }
}

export function validatePetriReachability(
  payload: PetriReachabilityPayload,
  solution: PetriReachabilitySolution,
  submission: PetriReachabilitySubmission,
  explanation: string
): ValidationResult {
  const correct = solution.correct ?? []
  const selected = submission.selected ?? []
  const passed =
    selected.length === 1 && correct.length === 1 && selected[0] === correct[0]
  const labels = new Map(payload.options.map((o) => [o.id, o.label]))
  return {
    passed,
    score: passed ? 1 : 0,
    feedback: [
      {
        ok: passed,
        criterion: "Graphe ou marquage accessible",
        detail: passed
          ? "Choix exact."
          : `Attendu : ${labels.get(correct[0]) ?? correct[0] ?? "?"}.`,
      },
    ],
    reveal: {
      canonicalSolution: correct.map((id) => labels.get(id) ?? id).join(", "),
      explanation,
    },
  }
}

function asNet(payload: PetriNet): PetriNet {
  return {
    places: payload.places,
    transitions: payload.transitions,
    arcs: payload.arcs,
  }
}

function expectedMatrix(payload: PetriMatrixPayload): PetriMatrix {
  if (payload.matrix === "pre") return preMatrix(payload)
  if (payload.matrix === "post") return postMatrix(payload)
  return incidenceMatrix(payload)
}

function normalizeMarking(marking: Marking): Marking {
  const normalized: Marking = {}
  for (const [key, value] of Object.entries(marking))
    normalized[key] = Number(value)
  return normalized
}

function sliceMatrix(
  matrix: PetriMatrix,
  cells: Array<{ placeId: string; transitionId: string }>
): PetriMatrix {
  const sliced: PetriMatrix = {}
  for (const cell of cells) {
    sliced[cell.placeId] ??= {}
    sliced[cell.placeId][cell.transitionId] = Number(
      matrix[cell.placeId]?.[cell.transitionId] ?? 0
    )
  }
  return sliced
}

function matrixToText(
  matrix: PetriMatrix,
  places: string[],
  transitions: string[]
): string {
  return places
    .map(
      (placeId) =>
        `${placeId}: ${transitions.map((transitionId) => `${transitionId}=${matrix[placeId]?.[transitionId] ?? 0}`).join(", ")}`
    )
    .join("\n")
}
