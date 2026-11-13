/**
 * Teaching-quality rules a new course must meet before it is published,
 * calibrated on Droit administratif and Droit des contrats.
 * Reads courses/<id>/ directly, so any course can be measured without selecting it.
 */
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { GATE_SIZE, isSelfGraded } from "@/lib/course"
import { parseFrontmatter } from "@/lib/mdx-meta"
import type { ExerciseType } from "@/lib/validators/types"

export const QUALITY_THRESHOLDS = {
  minAutoPerModule: GATE_SIZE,
  minTypesPerModule: 4,
  maxLongestCorrect: 0.35,
  trueShare: [0.35, 0.65],
} as const

export type RawExercise = {
  chapterSlug: string
  type: ExerciseType
  prompt: string
  payload: any // eslint-disable-line @typescript-eslint/no-explicit-any
  solution: any // eslint-disable-line @typescript-eslint/no-explicit-any
  hint?: string
  source?: string
  concepts?: string[]
}

export type CourseFiles = {
  modules: { slug: string; chapters: { slug: string; sections: string[] }[] }[]
  sections: {
    moduleSlug: string
    chapterSlug: string
    file: string
    written: boolean
    source: string | null
    concepts: string[]
  }[]
  concepts: { slug: string; summary?: string }[]
  /** exercises/*.json: the practice exercises of each chapter */
  exercises: RawExercise[]
  /** exam/*.json */
  exams: { slug: string; exercises: RawExercise[] }[]
}

export type QualityMetrics = {
  autoPerModule: Record<string, number>
  typesPerModule: Record<string, number>
  chaptersWithoutSection: string[]
  chaptersWithoutExercise: string[]
  missingSections: string[]
  mcqSingle: number
  mcqLongestCorrect: number
  trueFalse: number
  trueFalseTrue: number
  withoutHint: string[]
  withoutSource: string[]
  sectionsWithoutSource: string[]
  conceptsWithoutSummary: string[]
  conceptsWithoutSection: string[]
  conceptsWithoutExercise: string[]
  bestExam: { slug: string | null; missingModules: string[] }
}

function readJsonFiles<T>(dir: string): T[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as T)
}

export async function readCourse(dir: string): Promise<CourseFiles> {
  const { MODULES } = (await import(
    pathToFileURL(path.join(dir, "modules.ts")).href
  )) as { MODULES: CourseFiles["modules"] }
  const modules = MODULES.map((m) => ({
    slug: m.slug,
    chapters: m.chapters.map((c) => ({ slug: c.slug, sections: c.sections })),
  }))
  const sections = modules.flatMap((m) =>
    m.chapters.flatMap((c) =>
      c.sections.map((file) => {
        const mdxPath = path.join(dir, "theory", m.slug, `${file}.mdx`)
        if (!fs.existsSync(mdxPath)) {
          return {
            moduleSlug: m.slug,
            chapterSlug: c.slug,
            file,
            written: false,
            source: null,
            concepts: [],
          }
        }
        const meta = parseFrontmatter(fs.readFileSync(mdxPath, "utf8"))
        return {
          moduleSlug: m.slug,
          chapterSlug: c.slug,
          file,
          written: true,
          source: (meta.source as string | undefined) || null,
          concepts: (meta.concepts as string[] | undefined) ?? [],
        }
      })
    )
  )
  return {
    modules,
    sections,
    concepts: JSON.parse(
      fs.readFileSync(path.join(dir, "concepts.json"), "utf8")
    ),
    exercises: readJsonFiles<RawExercise[]>(path.join(dir, "exercises")).flat(),
    exams: readJsonFiles<{ slug: string; exercises: RawExercise[] }>(
      path.join(dir, "exam")
    ).map((e) => ({
      slug: e.slug,
      exercises: e.exercises,
    })),
  }
}

const label = (e: RawExercise) => `${e.chapterSlug} · ${e.prompt.slice(0, 60)}`

/** The single correct option is strictly longer than every other one. */
function correctIsLongest(e: RawExercise): boolean {
  const options: { id: string; label: string }[] = e.payload.options
  const correct = options.find((o) => o.id === e.solution.correct[0])
  return (
    !!correct &&
    options.every((o) => o === correct || o.label.length < correct.label.length)
  )
}

export function measureQuality(course: CourseFiles): QualityMetrics {
  const moduleOf = new Map(
    course.modules.flatMap((m) =>
      m.chapters.map((c) => [c.slug, m.slug] as const)
    )
  )
  const auto = course.exercises.filter((e) => !isSelfGraded(e.type))
  const everyAuto = [
    ...auto,
    ...course.exams.flatMap((x) =>
      x.exercises.filter((e) => !isSelfGraded(e.type))
    ),
  ]
  const written = course.sections.filter((s) => s.written)
  const chapters = course.modules.flatMap((m) => m.chapters)

  const autoPerModule: Record<string, number> = {}
  const typesPerModule: Record<string, number> = {}
  for (const m of course.modules) {
    const own = auto.filter((e) => moduleOf.get(e.chapterSlug) === m.slug)
    autoPerModule[m.slug] = own.length
    typesPerModule[m.slug] = new Set(own.map((e) => e.type)).size
  }

  const mcq = course.exercises.filter((e) => e.type === "MCQ_SINGLE")
  const trueFalse = course.exercises.filter((e) => e.type === "TRUE_FALSE")
  const inSections = new Set(written.flatMap((s) => s.concepts))
  const inExercises = new Set(
    [...course.exercises, ...course.exams.flatMap((x) => x.exercises)].flatMap(
      (e) => e.concepts ?? []
    )
  )

  const coverage = course.exams.map((x) => ({
    slug: x.slug,
    modules: new Set(x.exercises.map((e) => moduleOf.get(e.chapterSlug))),
  }))
  const best = coverage.reduce<(typeof coverage)[number] | null>(
    (a, b) => (!a || b.modules.size > a.modules.size ? b : a),
    null
  )

  return {
    autoPerModule,
    typesPerModule,
    chaptersWithoutSection: chapters
      .filter((c) => !written.some((s) => s.chapterSlug === c.slug))
      .map((c) => c.slug),
    chaptersWithoutExercise: chapters
      .filter((c) => !course.exercises.some((e) => e.chapterSlug === c.slug))
      .map((c) => c.slug),
    missingSections: course.sections
      .filter((s) => !s.written)
      .map((s) => `${s.moduleSlug}/${s.file}`),
    mcqSingle: mcq.length,
    mcqLongestCorrect: mcq.filter(correctIsLongest).length,
    trueFalse: trueFalse.length,
    trueFalseTrue: trueFalse.filter((e) => e.solution.value === true).length,
    withoutHint: everyAuto.filter((e) => !e.hint?.trim()).map(label),
    withoutSource: everyAuto.filter((e) => !e.source?.trim()).map(label),
    sectionsWithoutSource: written
      .filter((s) => !s.source?.trim())
      .map((s) => `${s.moduleSlug}/${s.file}`),
    conceptsWithoutSummary: course.concepts
      .filter((c) => !c.summary?.trim())
      .map((c) => c.slug),
    conceptsWithoutSection: course.concepts
      .filter((c) => !inSections.has(c.slug))
      .map((c) => c.slug),
    conceptsWithoutExercise: course.concepts
      .filter((c) => !inExercises.has(c.slug))
      .map((c) => c.slug),
    bestExam: {
      slug: best?.slug ?? null,
      missingModules: course.modules
        .filter((m) => !best?.modules.has(m.slug))
        .map((m) => m.slug),
    },
  }
}

const percent = (part: number, total: number) =>
  `${Math.round((100 * part) / total)} %`
const list = (items: string[]) =>
  items.slice(0, 5).join(" ; ") +
  (items.length > 5 ? ` ; et ${items.length - 5} autres` : "")

export function qualityErrors(m: QualityMetrics): string[] {
  const t = QUALITY_THRESHOLDS
  const errors: string[] = []
  for (const [slug, n] of Object.entries(m.autoPerModule)) {
    if (n < t.minAutoPerModule) {
      errors.push(
        `Module ${slug} : ${n} exercices auto-corrigés, il en faut au moins ${t.minAutoPerModule} pour l'examen de passage.`
      )
    }
  }
  for (const [slug, n] of Object.entries(m.typesPerModule)) {
    if (n < t.minTypesPerModule)
      errors.push(
        `Module ${slug} : ${n} types d'exercices auto-corrigés, il en faut au moins ${t.minTypesPerModule}.`
      )
  }
  for (const slug of m.chaptersWithoutSection)
    errors.push(`Chapitre ${slug} : aucune section de cours rédigée.`)
  for (const slug of m.chaptersWithoutExercise)
    errors.push(`Chapitre ${slug} : aucun exercice.`)
  for (const s of m.missingSections)
    errors.push(`Section ${s} : prévue dans modules.ts mais pas rédigée.`)
  if (m.mcqSingle && m.mcqLongestCorrect / m.mcqSingle > t.maxLongestCorrect) {
    errors.push(
      `QCM : la bonne réponse est la plus longue dans ${m.mcqLongestCorrect} sur ${m.mcqSingle} (${percent(m.mcqLongestCorrect, m.mcqSingle)}), au plus ${t.maxLongestCorrect * 100} %.`
    )
  }
  const trueShare = m.trueFalse ? m.trueFalseTrue / m.trueFalse : null
  if (
    trueShare !== null &&
    (trueShare < t.trueShare[0] || trueShare > t.trueShare[1])
  ) {
    errors.push(
      `Vrai ou faux : « vrai » est la réponse dans ${m.trueFalseTrue} sur ${m.trueFalse} (${percent(m.trueFalseTrue, m.trueFalse)}), il faut entre ${t.trueShare[0] * 100} et ${t.trueShare[1] * 100} %.`
    )
  }
  if (m.withoutHint.length)
    errors.push(
      `${m.withoutHint.length} exercice(s) sans indice (hint) : ${list(m.withoutHint)}`
    )
  if (m.withoutSource.length)
    errors.push(
      `${m.withoutSource.length} exercice(s) sans source : ${list(m.withoutSource)}`
    )
  for (const s of m.sectionsWithoutSource)
    errors.push(`Section ${s} : sans source.`)
  for (const slug of m.conceptsWithoutSummary)
    errors.push(`Notion ${slug} : sans résumé.`)
  for (const slug of m.conceptsWithoutSection)
    errors.push(`Notion ${slug} : absente de toutes les sections.`)
  for (const slug of m.conceptsWithoutExercise)
    errors.push(`Notion ${slug} : absente de tous les exercices.`)
  if (m.bestExam.missingModules.length) {
    errors.push(
      m.bestExam.slug
        ? `L'examen le plus complet (${m.bestExam.slug}) ne couvre pas les modules : ${m.bestExam.missingModules.join(", ")}.`
        : `Aucun examen : il en faut un qui couvre tous les modules (${m.bestExam.missingModules.join(", ")}).`
    )
  }
  return errors
}
