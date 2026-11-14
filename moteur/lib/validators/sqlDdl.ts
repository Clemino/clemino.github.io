import { containsWord, normalize } from "./normalize"
import type {
  SqlDdlElement,
  SqlDdlPayload,
  SqlDdlSolution,
  SqlDdlSubmission,
  ValidationResult,
} from "./types"

function checkElement(
  ddl: string,
  element: SqlDdlElement
): { ok: boolean; criterion: string; detail?: string } {
  const norm = normalize(ddl, { caseSensitive: false, stripAccents: true })
  switch (element.kind) {
    case "table": {
      const re = new RegExp(
        `create\\s+(?:global\\s+temporary\\s+|temporary\\s+)?table\\s+(?:if\\s+not\\s+exists\\s+)?["]?${element.name.toLowerCase()}["]?`,
        "i"
      )
      const ok = re.test(norm)
      return {
        ok,
        criterion: `Table « ${element.name} »`,
        detail: ok
          ? "Trouvée."
          : (element.description ?? `CREATE TABLE ${element.name} attendu.`),
      }
    }
    case "column": {
      const tableScope = new RegExp(
        `create\\s+table\\s+(?:if\\s+not\\s+exists\\s+)?["]?${element.table.toLowerCase()}["]?\\s*\\(([\\s\\S]*?)\\)`,
        "i"
      )
      const m = norm.match(tableScope)
      if (!m)
        return {
          ok: false,
          criterion: `Colonne « ${element.table}.${element.name} »`,
          detail: "Table parent absente.",
        }
      const body = m[1]
      const colRe = new RegExp(
        `(^|,)\\s*["]?${element.name.toLowerCase()}["]?\\s+${element.type ? element.type.toLowerCase().replace(/\s+/g, "\\s+") : "[a-z0-9_(),\\s]+"}`,
        "i"
      )
      const ok = colRe.test(body)
      return {
        ok,
        criterion: `Colonne « ${element.table}.${element.name} »`,
        detail: ok
          ? "Présente."
          : `Colonne ${element.name}${element.type ? ` ${element.type}` : ""} attendue.`,
      }
    }
    case "fk": {
      const re = new RegExp(
        `foreign\\s+key\\s*\\(\\s*["]?${element.from.column.toLowerCase()}["]?\\s*\\)\\s*references\\s+["]?${element.to.table.toLowerCase()}["]?\\s*\\(\\s*["]?${element.to.column.toLowerCase()}["]?\\s*\\)`,
        "i"
      )
      const ok = re.test(norm)
      return {
        ok,
        criterion: `Clé étrangère ${element.from.table}.${element.from.column} → ${element.to.table}.${element.to.column}`,
        detail: ok ? "Présente." : "FK manquante ou mal référencée.",
      }
    }
    case "constraint": {
      const re = new RegExp(element.pattern, "i")
      const ok = re.test(ddl)
      return {
        ok,
        criterion: element.description,
        detail: ok ? "Trouvée." : "Contrainte absente.",
      }
    }
    case "keyword": {
      const ok = containsWord(ddl, element.keyword)
      return {
        ok,
        criterion: element.description ?? `Mot-clé « ${element.keyword} »`,
        detail: ok
          ? "Présent."
          : `Le mot-clé « ${element.keyword} » doit apparaître.`,
      }
    }
  }
}

export function validateSqlDdl(
  payload: SqlDdlPayload,
  solution: SqlDdlSolution,
  submission: SqlDdlSubmission,
  explanation: string
): ValidationResult {
  const ddl = submission.ddl ?? ""
  if (!ddl.trim()) {
    return {
      passed: false,
      score: 0,
      feedback: [
        {
          ok: false,
          criterion: "DDL vide",
          detail: "Aucune instruction soumise.",
        },
      ],
      reveal: { canonicalSolution: solution.ddl, explanation },
    }
  }

  const feedback = payload.requiredElements.map((el) => checkElement(ddl, el))
  const okCount = feedback.filter((f) => f.ok).length
  const score = payload.requiredElements.length
    ? okCount / payload.requiredElements.length
    : 0
  const passed = score >= 0.9

  return {
    passed,
    score,
    feedback,
    reveal: { canonicalSolution: solution.ddl, explanation },
  }
}
