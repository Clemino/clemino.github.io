import { containsWord } from "./normalize"
import type {
  PlsqlProcPayload,
  PlsqlProcSolution,
  PlsqlProcSubmission,
  ValidationCriterion,
  ValidationResult,
} from "./types"

function parseHeader(code: string) {
  // PROCEDURE / FUNCTION header — best-effort
  const procRe =
    /CREATE\s+(?:OR\s+REPLACE\s+)?PROCEDURE\s+([A-Z0-9_."]+)\s*(?:\(([\s\S]*?)\))?\s*(?:IS|AS)/i
  const funcRe =
    /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+([A-Z0-9_."]+)\s*(?:\(([\s\S]*?)\))?\s*RETURN\s+([A-Z0-9_.()]+)\s*(?:IS|AS)/i
  const procMatch = code.match(procRe)
  if (procMatch) {
    return {
      kind: "PROCEDURE" as const,
      name: procMatch[1],
      paramsRaw: procMatch[2] ?? "",
      returnType: null,
    }
  }
  const funcMatch = code.match(funcRe)
  if (funcMatch) {
    return {
      kind: "FUNCTION" as const,
      name: funcMatch[1],
      paramsRaw: funcMatch[2] ?? "",
      returnType: funcMatch[3],
    }
  }
  // Anonymous block
  if (/^\s*DECLARE\b/i.test(code) || /^\s*BEGIN\b/i.test(code)) {
    return {
      kind: "BLOCK" as const,
      name: null,
      paramsRaw: "",
      returnType: null,
    }
  }
  return null
}

function parseParams(raw: string) {
  if (!raw.trim()) return []
  return raw
    .split(/,(?![^(]*\))/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => {
      const m = p.match(
        /^([A-Z0-9_]+)\s+(IN\s+OUT|OUT|IN)?\s*([A-Z0-9_.()%]+)?/i
      )
      if (!m) return { name: p, mode: undefined, type: undefined }
      return {
        name: m[1]?.toUpperCase(),
        mode: (m[2]?.toUpperCase().replace(/\s+/g, " ") ?? "IN") as
          | "IN"
          | "OUT"
          | "IN OUT",
        type: m[3]?.toUpperCase(),
      }
    })
}

export function validatePlsqlProc(
  payload: PlsqlProcPayload,
  solution: PlsqlProcSolution,
  submission: PlsqlProcSubmission,
  explanation: string
): ValidationResult {
  const required = payload.required ?? {}
  const code = submission.code ?? ""
  if (!code.trim()) {
    return {
      passed: false,
      score: 0,
      feedback: [{ ok: false, criterion: "Code vide" }],
      reveal: { canonicalSolution: solution.code, explanation },
    }
  }

  const parsed = parseHeader(code)
  const feedback: ValidationCriterion[] = []

  feedback.push({
    ok: parsed !== null,
    criterion: "En-tête reconnaissable",
    detail: parsed
      ? `Type détecté : ${parsed.kind}.`
      : "Impossible de parser CREATE PROCEDURE/FUNCTION ou bloc DECLARE/BEGIN.",
  })

  if (parsed && required.kind) {
    const ok = parsed.kind === required.kind
    feedback.push({
      ok,
      criterion: `Type ${required.kind}`,
      detail: ok ? "OK." : `Reçu : ${parsed.kind}.`,
    })
  }

  if (parsed && required.name && parsed.name) {
    const ok = parsed.name.toUpperCase() === required.name.toUpperCase()
    feedback.push({
      ok,
      criterion: `Nom « ${required.name} »`,
      detail: ok ? "Correct." : `Reçu : ${parsed.name}.`,
    })
  }

  if (parsed && required.params && required.params.length > 0) {
    const params = parseParams(parsed.paramsRaw)
    for (let i = 0; i < required.params.length; i++) {
      const expected = required.params[i]
      const actual = params[i]
      const matchName =
        !expected.name ||
        actual?.name?.toUpperCase() === expected.name.toUpperCase()
      const matchMode = !expected.mode || actual?.mode === expected.mode
      const matchType =
        !expected.type ||
        (actual?.type ?? "").toUpperCase().includes(expected.type.toUpperCase())
      const ok = Boolean(actual && matchName && matchMode && matchType)
      feedback.push({
        ok,
        criterion: `Paramètre ${i + 1}${expected.name ? ` « ${expected.name} »` : ""}`,
        detail: ok
          ? "OK."
          : `Attendu : ${expected.name ?? "?"} ${expected.mode ?? ""} ${expected.type ?? ""}. Reçu : ${actual?.name ?? "rien"} ${actual?.mode ?? ""} ${actual?.type ?? ""}.`,
      })
    }
  }

  if (parsed && required.returnType && parsed.kind === "FUNCTION") {
    const ok = (parsed.returnType ?? "")
      .toUpperCase()
      .includes(required.returnType.toUpperCase())
    feedback.push({
      ok,
      criterion: `Type de retour « ${required.returnType} »`,
      detail: ok ? "OK." : `Reçu : ${parsed.returnType}.`,
    })
  }

  for (const kw of required.requiredKeywords ?? []) {
    const ok = containsWord(code, kw)
    feedback.push({
      ok,
      criterion: `Présence de « ${kw} »`,
      detail: ok ? "OK." : `Le code doit contenir « ${kw} ».`,
    })
  }

  for (const section of required.requiredSections ?? []) {
    const re = new RegExp(`\\b${section}\\b`, "i")
    const ok = re.test(code)
    feedback.push({
      ok,
      criterion: `Section ${section}`,
      detail: ok ? "Présente." : `La section ${section} est requise.`,
    })
  }

  // Always require END;
  const hasEnd = /END\s*;?\s*$/i.test(code.trim())
  feedback.push({
    ok: hasEnd,
    criterion: "Terminé par END",
    detail: hasEnd ? "OK." : "Le bloc doit se terminer par END;",
  })

  const okCount = feedback.filter((f) => f.ok).length
  const score = feedback.length ? okCount / feedback.length : 0
  const passed = score >= 0.85 && parsed !== null

  return {
    passed,
    score,
    feedback,
    reveal: { canonicalSolution: solution.code, explanation },
  }
}
