import { containsWord } from "./normalize"
import type {
  PlsqlTriggerPayload,
  PlsqlTriggerSolution,
  PlsqlTriggerSubmission,
  ValidationCriterion,
  ValidationResult,
} from "./types"

function parseTriggerHeader(code: string) {
  // Match: CREATE [OR REPLACE] TRIGGER <name> {BEFORE|AFTER|INSTEAD OF} <events> ON <table> [FOR EACH ROW] [WHEN (...)]
  const re =
    /CREATE\s+(?:OR\s+REPLACE\s+)?TRIGGER\s+([A-Z0-9_."]+)\s+(BEFORE|AFTER|INSTEAD\s+OF)\s+([A-Z0-9_.,"\s]+?)\s+ON\s+([A-Z0-9_."]+)([\s\S]*?)(?:DECLARE|BEGIN)/i
  const m = code.match(re)
  if (!m) return null
  const eventsRaw = m[3].toUpperCase()
  const events: Array<"INSERT" | "UPDATE" | "DELETE"> = []
  for (const ev of ["INSERT", "UPDATE", "DELETE"] as const) {
    if (new RegExp(`\\b${ev}\\b`).test(eventsRaw)) events.push(ev)
  }
  const tail = m[5]
  const forEachRow = /FOR\s+EACH\s+ROW/i.test(tail)
  const whenMatch = tail.match(/WHEN\s*\(\s*([\s\S]+?)\s*\)\s*(?:DECLARE|BEGIN|$)/i)
  return {
    name: m[1].replace(/["]/g, "").toUpperCase(),
    timing: m[2].toUpperCase().replace(/\s+/g, " ") as "BEFORE" | "AFTER" | "INSTEAD OF",
    events,
    table: m[4].replace(/["]/g, "").toUpperCase(),
    forEachRow,
    when: whenMatch?.[1],
  }
}

export function validatePlsqlTrigger(
  payload: PlsqlTriggerPayload,
  solution: PlsqlTriggerSolution,
  submission: PlsqlTriggerSubmission,
  explanation: string,
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

  const parsed = parseTriggerHeader(code)
  const feedback: ValidationCriterion[] = []

  feedback.push({
    ok: parsed !== null,
    criterion: "Structure CREATE TRIGGER reconnaissable",
    detail: parsed
      ? "En-tête correctement formé."
      : "Impossible de parser l'en-tête. Vérifiez la syntaxe : CREATE [OR REPLACE] TRIGGER nom ...",
  })

  if (parsed) {
    if (required.triggerName) {
      const ok = parsed.name.toUpperCase() === required.triggerName.toUpperCase()
      feedback.push({
        ok,
        criterion: `Nom du trigger « ${required.triggerName} »`,
        detail: ok ? "Correct." : `Reçu : ${parsed.name}.`,
      })
    }
    if (required.timing) {
      const ok = parsed.timing.replace(/\s+/g, "") === required.timing.replace(/\s+/g, "")
      feedback.push({
        ok,
        criterion: `Timing ${required.timing}`,
        detail: ok ? "Correct." : `Reçu : ${parsed.timing}.`,
      })
    }
    if (required.events && required.events.length > 0) {
      const ok = required.events.every((e) => parsed.events.includes(e))
      feedback.push({
        ok,
        criterion: `Événements ${required.events.join("/")}`,
        detail: ok ? "Tous présents." : `Manquant(s) : ${required.events.filter((e) => !parsed.events.includes(e)).join(", ")}`,
      })
    }
    if (required.table) {
      const ok = parsed.table.toUpperCase() === required.table.toUpperCase()
      feedback.push({
        ok,
        criterion: `Table cible « ${required.table} »`,
        detail: ok ? "Correcte." : `Reçue : ${parsed.table}.`,
      })
    }
    if (required.forEachRow !== undefined) {
      const ok = parsed.forEachRow === required.forEachRow
      feedback.push({
        ok,
        criterion: required.forEachRow ? "FOR EACH ROW présent" : "Trigger niveau instruction (sans FOR EACH ROW)",
        detail: ok ? "OK." : required.forEachRow ? "Manquant." : "À retirer.",
      })
    }
  }

  for (const kw of required.requiredKeywords ?? []) {
    const ok = containsWord(code, kw)
    feedback.push({
      ok,
      criterion: `Présence de « ${kw} »`,
      detail: ok ? "OK." : `Le code doit contenir « ${kw} ».`,
    })
  }

  for (const kw of required.forbiddenKeywords ?? []) {
    const present = containsWord(code, kw)
    feedback.push({
      ok: !present,
      criterion: `Absence de « ${kw} »`,
      detail: !present ? "OK." : `Évitez l'utilisation de « ${kw} » ici.`,
    })
  }

  // BEGIN ... END block check
  const hasBlock = /BEGIN[\s\S]+END\s*;?/i.test(code)
  feedback.push({
    ok: hasBlock,
    criterion: "Bloc BEGIN ... END présent",
    detail: hasBlock ? "OK." : "Le corps du trigger doit être encadré par BEGIN / END;",
  })

  const okCount = feedback.filter((f) => f.ok).length
  const score = feedback.length ? okCount / feedback.length : 0
  const passed = score >= 0.9 && parsed !== null

  return { passed, score, feedback, reveal: { canonicalSolution: solution.code, explanation } }
}
