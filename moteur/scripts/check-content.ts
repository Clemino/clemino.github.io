/**
 * Static check of content/: every exercise must reference a known chapter and
 * known concepts, and its own solution must pass the real validator.
 * Usage: pnpm check:content
 */
import fs from "node:fs"
import path from "node:path"
import { MODULES } from "../content/modules"
import { getCatalog } from "../lib/catalog"
import { validate } from "../lib/validators"
import { answerTexts } from "../lib/validators/canonical"
import { CODE_CHECKS } from "../lib/validators/code"
import { normalize } from "../lib/validators/normalize"
import type { AnySubmission, ExerciseType } from "../lib/validators/types"

type Ex = {
  chapterSlug: string
  type: ExerciseType
  prompt: string
  payload: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  solution: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  explanation: string
  hint?: string
  concepts?: string[]
}

const contentDir = path.join(process.cwd(), "content")
const chapterSlugs = new Set(MODULES.flatMap((m) => m.chapters.map((c) => c.slug)))
const conceptSlugs = new Set(
  (JSON.parse(fs.readFileSync(path.join(contentDir, "concepts.json"), "utf8")) as { slug: string }[]).map((c) => c.slug),
)
// Progress is keyed by slug in a plain object, where these names already exist.
for (const slug of conceptSlugs) if (slug in {}) throw new Error(`Concept slug reserved by JavaScript: ${slug}`)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function correctSubmission(type: string, payload: any, solution: any): AnySubmission {
  switch (type) {
    case "MCQ_SINGLE":
    case "MCQ_MULTI":
      return { selected: solution.correct }
    case "TRUE_FALSE":
      return { value: solution.value }
    case "FILL_BLANK":
      return { values: Object.fromEntries(Object.entries(solution.answers).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])) } as AnySubmission
    case "ORDERING":
      return { order: solution.order }
    case "MATCHING":
      return { pairs: solution.pairs }
    case "PREDICT_OUTPUT":
      return { output: solution.expectedOutput }
    case "NUMERIC":
      return { value: String(solution.value) }
    case "ALGO_TRACE":
      return { values: Object.fromEntries(solution.cells.map((c: { id: string; expected: unknown }) => [c.id, String(c.expected)])) }
    case "PETRI_ENABLED_TRANSITIONS":
      return { selectedTransitionIds: solution.enabledTransitionIds }
    case "PETRI_FIRE_SEQUENCE":
      return { marking: solution.finalMarking }
    case "PETRI_MATRIX":
      return { matrix: solution.matrix }
    case "PETRI_PROPERTY":
    case "PETRI_INVARIANT":
    case "PETRI_REACHABILITY":
      return { selected: solution.correct }
    case "CODE_WRITE":
    case "CODE_FIX":
      return { code: solution.referenceCode, checked: CODE_CHECKS.map((c) => c.id) }
    case "CHART_READ":
      return { candle: solution.candles?.[0], price: solution.price, selected: solution.correct }
    case "TRADE_PLAN":
      return { values: Object.fromEntries(Object.entries(solution.reference).map(([k, v]) => [k, String(v)])) }
    case "SQL_DDL":
      return { ddl: solution.ddl }
    case "PLSQL_BLOCK":
    case "PLSQL_TRIGGER":
    case "PLSQL_PROCEDURE":
      return { code: solution.code }
    case "TRACE_EXECUTION":
      return { output: solution.expectedOutput }
    case "RUBRIC_OPEN":
      return { text: solution.modelAnswer }
    case "CASE_STUDY":
    case "CODE_ANALYSIS":
    case "FIGURE_INTERPRET":
      return {
        answers: Object.fromEntries(
          payload.subQuestions.map((q: { id: string; type: string; payload: unknown }) => {
            const sub = solution.subSolutions.find((s: { id: string }) => s.id === q.id)
            return [q.id, correctSubmission(q.type, q.payload, sub?.solution)]
          }),
        ),
      } as AnySubmission
    case "WRITING":
      return { text: "", checked: payload.rubric.map((c: { id: string }) => c.id) }
    default:
      throw new Error(`type inconnu ${type}`)
  }
}

const hasDuplicate = (labels: string[]) => new Set(labels).size !== labels.length

function structuralErrors(ex: Ex): string[] {
  const errs: string[] = []
  const p = ex.payload
  const s = ex.solution
  if (ex.type === "MCQ_SINGLE" || ex.type === "MCQ_MULTI") {
    const ids = new Set(p.options.map((o: { id: string }) => o.id))
    if (ids.size !== p.options.length) errs.push("ids d'options dupliqués")
    if (s.correct.some((c: string) => !ids.has(c))) errs.push("réponse hors options")
    if (ex.type === "MCQ_SINGLE" && s.correct.length !== 1) errs.push("MCQ_SINGLE doit avoir une seule bonne réponse")
    if (hasDuplicate(p.options.map((o: { label: string }) => o.label))) errs.push("deux options ont le même texte")
  }
  if (ex.type === "MATCHING") {
    const left = p.left.map((l: { id: string }) => l.id).sort().join()
    if (Object.keys(s.pairs).sort().join() !== left) errs.push("paires incomplètes")
    if (hasDuplicate(p.right.map((r: { label: string }) => r.label))) errs.push("deux réponses ont le même texte")
  }
  if (ex.type === "ORDERING") {
    const items = p.items.map((l: { id: string }) => l.id).sort().join()
    if ([...s.order].sort().join() !== items) errs.push("ordre incomplet")
  }
  if (ex.type === "FILL_BLANK") {
    for (const slot of p.slots) {
      if (!p.template.includes(`{{${slot.id}}}`)) errs.push(`trou ${slot.id} absent du gabarit`)
      if (!(slot.id in s.answers)) errs.push(`trou ${slot.id} sans réponse`)
    }
  }
  if (ex.type === "CASE_STUDY") {
    if (!p.scenario?.trim()) errs.push("énoncé du cas vide")
    for (const q of p.subQuestions) {
      const sub = s.subSolutions.find((x: { id: string }) => x.id === q.id)
      if (!sub) errs.push(`sous-question ${q.id} sans réponse`)
      else errs.push(...structuralErrors({ ...ex, type: q.type, payload: q.payload, solution: sub.solution }))
    }
  }
  if (ex.type === "CHART_READ" && p.mode === "candle" && s.candles.some((n: number) => n < 1 || n > p.candles.length)) {
    errs.push("bougie hors graphique")
  }
  if (ex.type === "WRITING" && (!p.modelAnswer?.trim() || p.rubric.length < 3)) errs.push("corrigé ou grille incomplets")
  return errs
}

async function checkFile(file: string, exercises: Ex[]): Promise<number> {
  let errors = 0
  const prompts = new Set<string>()
  for (const [i, ex] of exercises.entries()) {
    const where = `${path.relative(contentDir, file)} #${i + 1}`
    const errs = structuralErrors(ex)
    if (!chapterSlugs.has(ex.chapterSlug)) errs.push(`chapitre inconnu ${ex.chapterSlug}`)
    for (const c of ex.concepts ?? []) if (!conceptSlugs.has(c)) errs.push(`concept inconnu ${c}`)
    if (!ex.explanation?.trim()) errs.push("explication vide")
    // Without a written hint, the catalog falls back on a concept summary.
    if (ex.type !== "WRITING" && !ex.hint?.trim() && !ex.concepts?.length) errs.push("rappel de cours manquant")
    for (const answer of answerTexts(ex.type, ex.payload as never, ex.solution as never)) {
      if (ex.hint && normalize(ex.hint).includes(normalize(answer))) errs.push(`le rappel donne la réponse : ${answer}`)
    }
    const key = JSON.stringify([ex.chapterSlug, ex.prompt, ex.payload])
    if (prompts.has(key)) errs.push("exercice en double")
    prompts.add(key)
    if (errs.length === 0) {
      const r = await validate({
        type: ex.type,
        payload: ex.payload as never,
        solution: ex.solution as never,
        submission: correctSubmission(ex.type, ex.payload, ex.solution),
        explanation: ex.explanation,
      })
      if (!r.passed) errs.push(`la solution ne passe pas le correcteur : ${r.feedback.filter((f) => !f.ok).map((f) => f.criterion).join(" ; ")}`)
    }
    for (const e of errs) console.error(`✗ ${where} — ${e}`)
    errors += errs.length
  }
  return errors
}

async function main() {
  let errors = 0
  let count = 0
  for (const dir of ["exercises", "exam"]) {
    const full = path.join(contentDir, dir)
    for (const f of fs.readdirSync(full).filter((x) => x.endsWith(".json")).sort()) {
      const file = path.join(full, f)
      const data = JSON.parse(fs.readFileSync(file, "utf8"))
      const exercises: Ex[] = dir === "exam" ? data.exercises : data
      errors += await checkFile(file, exercises)
      count += exercises.length
      console.log(`${f} : ${exercises.length} exercices`)
    }
  }
  const catalog = getCatalog()
  for (const section of catalog.modules.flatMap((m) => m.chapters.flatMap((c) => c.sections))) {
    for (const c of section.concepts) {
      if (conceptSlugs.has(c)) continue
      console.error(`✗ ${section.mdxPath} — concept inconnu ${c}`)
      errors++
    }
  }
  const written = catalog.modules.flatMap((m) => m.chapters.flatMap((c) => c.sections)).length
  const planned = MODULES.flatMap((m) => m.chapters.flatMap((c) => c.sections)).length
  console.log(`\nThéorie : ${written}/${planned} sections rédigées`)
  console.log(errors ? `\n${errors} erreur(s) sur ${count} exercices` : `\nOK — ${count} exercices vérifiés`)
  process.exit(errors ? 1 : 0)
}

main()
