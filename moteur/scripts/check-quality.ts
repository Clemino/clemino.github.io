/**
 * Teaching-quality check of a new course, compared with the reference courses.
 * Usage: COURSE=<id> pnpm check:quality
 */
import fs from "node:fs"
import path from "node:path"
import {
  measureQuality,
  qualityErrors,
  readCourse,
  type QualityMetrics,
} from "../lib/quality"

const REFERENCES = ["admin", "contrats"]
const coursesDir = path.join(process.cwd(), "courses")

const share = (part: number, total: number) =>
  total ? `${Math.round((100 * part) / total)} %` : "—"
const minimum = (values: Record<string, number>) =>
  String(Math.min(...Object.values(values)))

const ROWS: [string, (m: QualityMetrics) => string][] = [
  ["Exercices auto-corrigés par module (min)", (m) => minimum(m.autoPerModule)],
  ["Types d'exercices par module (min)", (m) => minimum(m.typesPerModule)],
  [
    "QCM : bonne réponse la plus longue",
    (m) => share(m.mcqLongestCorrect, m.mcqSingle),
  ],
  [
    "Vrai ou faux : part de « vrai »",
    (m) => share(m.trueFalseTrue, m.trueFalse),
  ],
  [
    "Modules couverts par le meilleur examen",
    (m) => {
      const total = Object.keys(m.autoPerModule).length
      return `${total - m.bestExam.missingModules.length}/${total}`
    },
  ],
]

async function main() {
  const ids = fs.readdirSync(coursesDir).sort()
  const course = process.env.COURSE
  if (!course || !ids.includes(course)) {
    console.error(`COURSE=<id> attendu, parmi : ${ids.join(", ")}`)
    process.exit(1)
  }

  const columns = [course, ...REFERENCES.filter((id) => id !== course)]
  const metrics = await Promise.all(
    columns.map(async (id) =>
      measureQuality(await readCourse(path.join(coursesDir, id)))
    )
  )
  const errors = qualityErrors(metrics[0])
  for (const e of errors) console.error(`✗ ${e}`)

  const width = Math.max(...ROWS.map(([label]) => label.length))
  console.log(
    `\n${"".padEnd(width)}  ${columns.map((c) => c.padStart(10)).join("")}`
  )
  for (const [label, value] of ROWS)
    console.log(
      `${label.padEnd(width)}  ${metrics.map((m) => value(m).padStart(10)).join("")}`
    )

  console.log(
    errors.length
      ? `\n${errors.length} règle(s) non respectée(s)`
      : "\nOK — toutes les règles sont respectées"
  )
  process.exit(errors.length ? 1 : 0)
}

main()
