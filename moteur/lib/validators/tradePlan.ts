import type {
  TradePlanFields,
  TradePlanPayload,
  TradePlanSolution,
  TradePlanSubmission,
  ValidationCriterion,
  ValidationResult,
} from "./types"

const EPS = 1e-9
const FIELDS: (keyof TradePlanFields)[] = ["entry", "stop", "target", "size"]

const fmt = (x: number) => String(Math.round(x * 100) / 100)

function parse(raw: string | undefined): number {
  const s = (raw ?? "").trim().replace(/,/g, ".")
  return s === "" ? NaN : Number(s)
}

/**
 * Checks each rule of a trade plan independently and awards partial credit:
 * stop/target on the right side, risk within budget, minimum risk/reward,
 * size consistent with the risk budget, plus optional scenario constraints.
 */
export function validateTradePlan(
  payload: TradePlanPayload,
  solution: TradePlanSolution,
  submission: TradePlanSubmission,
  explanation: string
): ValidationResult {
  const cur = payload.currency ?? "€"
  const ref = solution.reference
  const canonicalSolution = `Entrée ${ref.entry} · Stop ${ref.stop} · Objectif ${ref.target} · Taille ${ref.size}`
  const v = Object.fromEntries(
    FIELDS.map((f) => [f, parse(submission?.values?.[f])])
  ) as TradePlanFields

  if (FIELDS.some((f) => !Number.isFinite(v[f]) || v[f] <= 0)) {
    return {
      passed: false,
      score: 0,
      feedback: [
        {
          ok: false,
          criterion: "Plan incomplet",
          detail:
            "Entrée, stop, objectif et taille doivent être des nombres positifs.",
        },
      ],
      reveal: { canonicalSolution, explanation },
    }
  }

  const long = payload.direction === "long"
  const riskPerUnit = Math.abs(v.entry - v.stop)
  const budget = (payload.capital * payload.maxRiskPct) / 100
  const risk = v.size * riskPerUnit
  const rr = riskPerUnit > 0 ? Math.abs(v.target - v.entry) / riskPerUnit : 0
  const idealSize = riskPerUnit > 0 ? budget / riskPerUnit : 0
  const sizeTol = solution.sizeTol ?? 1

  const sidesOk = long
    ? v.stop < v.entry && v.target > v.entry
    : v.stop > v.entry && v.target < v.entry
  const feedback: ValidationCriterion[] = [
    {
      ok: sidesOk,
      criterion: "Stop et objectif du bon côté de l'entrée",
      detail: long
        ? "En position acheteuse, le stop est sous l'entrée et l'objectif au-dessus."
        : "En position vendeuse, le stop est au-dessus de l'entrée et l'objectif en dessous.",
    },
    {
      ok: risk <= budget + EPS,
      criterion: `Risque ≤ ${payload.maxRiskPct} % du capital (${fmt(budget)} ${cur})`,
      detail: `Ton risque : ${fmt(v.size)} × ${fmt(riskPerUnit)} = ${fmt(risk)} ${cur}.`,
    },
    {
      ok: sidesOk && rr >= payload.minRR - EPS,
      criterion: `Ratio risque/rendement ≥ ${payload.minRR}`,
      detail: `Ton ratio : ${fmt(rr)}.`,
    },
    {
      ok: riskPerUnit > 0 && Math.abs(v.size - idealSize) <= sizeTol + EPS,
      criterion: "Taille cohérente avec le risque autorisé",
      detail: `Avec ce stop, la taille maximale est ${fmt(budget)} / ${fmt(riskPerUnit)} ≈ ${fmt(idealSize)}.`,
    },
  ]

  if (solution.entryRange) {
    const [min, max] = solution.entryRange
    feedback.push({
      ok: v.entry >= min - EPS && v.entry <= max + EPS,
      criterion: `Entrée conforme au scénario (entre ${min} et ${max})`,
    })
  }
  if (solution.stopRange) {
    const [min, max] = solution.stopRange
    feedback.push({
      ok: v.stop >= min - EPS && v.stop <= max + EPS,
      criterion: `Stop placé selon le scénario (entre ${min} et ${max})`,
    })
  }

  const okCount = feedback.filter((c) => c.ok).length
  return {
    passed: okCount === feedback.length,
    score: okCount / feedback.length,
    feedback,
    reveal: { canonicalSolution, explanation },
  }
}
