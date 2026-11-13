import { createHash } from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { MODULES } from "@/content/modules"
import { isSelfGraded, type ConceptInfo, type CourseIndex, type ExamInfo, type Exercise } from "@/lib/course"
import { answerTexts } from "@/lib/validators/canonical"
import { normalize } from "@/lib/validators/normalize"
import { parseFrontmatter, readingMinutes } from "@/lib/mdx-meta"
import type {
  AnyPayload,
  AnySolution,
  ExerciseType,
} from "@/lib/validators/types"

export const GATE_THRESHOLD = 0.8

export type CatalogSection = {
  id: string
  slug: string
  order: number
  title: string
  mdxPath: string
  estimatedReadMin: number
  concepts: string[]
  source: string | null
}

export type CatalogChapter = {
  slug: string
  order: number
  title: string
  sections: CatalogSection[]
  exercises: Exercise[]
}

export type CatalogModule = {
  slug: string
  order: number
  title: string
  subtitle: string | null
  description: string
  chapters: CatalogChapter[]
  gatePoolIds: string[]
}

export type CatalogExam = Omit<ExamInfo, "questionCount"> & {
  exercises: Exercise[]
}

export type CatalogConcept = {
  slug: string
  label: string
  summary: string | null
}

export type Catalog = {
  modules: CatalogModule[]
  exams: CatalogExam[]
  concepts: CatalogConcept[]
}

type ExerciseJson = {
  chapterSlug: string
  type: ExerciseType
  difficulty: number
  points: number
  prompt: string
  payload: AnyPayload
  solution: AnySolution
  explanation: string
  hint?: string
  concepts?: string[]
  source?: string
}

type ExamJson = {
  slug: string
  title: string
  description: string
  durationMinutes: number
  exercises: ExerciseJson[]
}

// Self-graded work cannot unlock a module, count towards concept mastery or be marked in an exam.
const isAutoGraded = (e: Exercise) => !isSelfGraded(e.type)

/** True when the text repeats most of the answer's words, so it cannot be shown after a wrong try. */
function givesAwayAnswer(text: string, answer: string): boolean {
  const words = normalize(answer).split(/\W+/).filter((w) => w.length > 3)
  const haystack = normalize(text)
  if (!words.length) return haystack.includes(normalize(answer))
  return words.filter((w) => haystack.includes(w)).length / words.length >= 0.6
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T
}

function hash(text: string): string {
  return createHash("sha1").update(text).digest("hex")
}

/**
 * Progress stored in the browser references these ids, so they must survive
 * rebuilds and content insertions: they depend on the prompt, not on position.
 */
export function exerciseId(scope: string, prompt: string): string {
  return hash(`${scope}\n${prompt}`).slice(0, 12)
}

function loadCatalog(contentDir: string): Catalog {
  const concepts = readJson<
    Array<{ slug: string; label: string; summary?: string }>
  >(path.join(contentDir, "concepts.json")).map((c) => ({
    slug: c.slug,
    label: c.label,
    summary: c.summary ?? null,
  }))

  const modules: CatalogModule[] = MODULES.map((mod) => ({
    slug: mod.slug,
    order: mod.order,
    title: mod.title,
    subtitle: mod.subtitle ?? null,
    description: mod.description,
    gatePoolIds: [],
    chapters: mod.chapters.map((ch) => ({
      slug: ch.slug,
      order: ch.order,
      title: ch.title,
      exercises: [],
      sections: ch.sections.flatMap((sectionFile, i) => {
        const mdxPath = `theory/${mod.slug}/${sectionFile}.mdx`
        const fullPath = path.join(contentDir, mdxPath)
        if (!fs.existsSync(fullPath)) return []
        const mdx = fs.readFileSync(fullPath, "utf8")
        const meta = parseFrontmatter(mdx)
        const slug = (meta.slug as string) ?? sectionFile
        return [
          {
            id: `${ch.slug}/${slug}`,
            slug,
            order: i + 1,
            title: (meta.title as string) ?? sectionFile,
            mdxPath,
            estimatedReadMin: readingMinutes(mdx),
            concepts: (meta.concepts as string[]) ?? [],
            source: (meta.source as string) ?? null,
          },
        ]
      }),
    })),
  }))

  const chapters = new Map(
    modules.flatMap((m) =>
      m.chapters.map((c) => [c.slug, { mod: m, chapter: c }] as const)
    )
  )
  const seenIds = new Set<string>()

  const conceptsBySlug = new Map(concepts.map((c) => [c.slug, c]))

  /** Courses without written hints fall back on the summary of a concept the exercise covers. */
  function conceptReminder(ex: ExerciseJson): string | null {
    const answers = answerTexts(ex.type, ex.payload, ex.solution)
    for (const slug of ex.concepts ?? []) {
      const concept = conceptsBySlug.get(slug)
      if (concept?.summary && !answers.some((a) => givesAwayAnswer(concept.summary!, a))) {
        return `**${concept.label}** : ${concept.summary}`
      }
    }
    return null
  }

  function addExercise(scope: string, ex: ExerciseJson): Exercise {
    const home = chapters.get(ex.chapterSlug)
    if (!home) throw new Error(`Unknown chapter ${ex.chapterSlug} in ${scope}`)
    let id = exerciseId(scope, ex.prompt)
    // Same wording on another program or figure: the payload tells them apart.
    if (seenIds.has(id)) id = exerciseId(scope, ex.prompt + JSON.stringify(ex.payload))
    if (seenIds.has(id))
      throw new Error(`Duplicate exercise in ${scope}: ${ex.prompt.slice(0, 60)}`)
    seenIds.add(id)
    const exercise: Exercise = {
      id,
      moduleSlug: home.mod.slug,
      chapterSlug: ex.chapterSlug,
      type: ex.type,
      difficulty: ex.difficulty,
      points: ex.points,
      prompt: ex.prompt,
      payload: ex.payload,
      solution: ex.solution,
      explanation: ex.explanation,
      hint: ex.hint ?? conceptReminder(ex),
      concepts: ex.concepts ?? [],
      source: ex.source ?? null,
    }
    home.chapter.exercises.push(exercise)
    return exercise
  }

  for (const mod of MODULES) {
    for (const suffix of ["", "-plus"]) {
      const file = path.join(
        contentDir,
        "exercises",
        `${mod.slug}${suffix}.json`
      )
      if (!fs.existsSync(file)) continue
      for (const ex of readJson<ExerciseJson[]>(file))
        addExercise(ex.chapterSlug, ex)
    }
  }

  const examDir = path.join(contentDir, "exam")
  const exams: CatalogExam[] = fs
    .readdirSync(examDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const exam = readJson<ExamJson>(path.join(examDir, file))
      // Self-graded questions stay available in their chapter, but cannot be marked here.
      const exercises = exam.exercises.map((ex) => addExercise(exam.slug, ex)).filter(isAutoGraded)
      return {
        slug: exam.slug,
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        totalPoints: exercises.reduce((sum, e) => sum + e.points, 0),
        exercises,
      }
    })
    .sort((a, b) => b.slug.localeCompare(a.slug))

  for (const m of modules) {
    m.gatePoolIds = m.chapters.flatMap((c) => c.exercises.filter(isAutoGraded).map((e) => e.id))
  }

  return { modules, exams, concepts }
}

let cached: Catalog | undefined

export function getCatalog(): Catalog {
  cached ??= loadCatalog(path.join(process.cwd(), "content"))
  return cached
}

export function getModule(slug: string): CatalogModule | undefined {
  return getCatalog().modules.find((m) => m.slug === slug)
}

export function getChapter(
  moduleSlug: string,
  chapterSlug: string
): CatalogChapter | undefined {
  return getModule(moduleSlug)?.chapters.find((c) => c.slug === chapterSlug)
}

export function getExam(slug: string): CatalogExam | undefined {
  return getCatalog().exams.find((e) => e.slug === slug)
}

export function getExamInfo({ exercises, ...exam }: CatalogExam): ExamInfo {
  return { ...exam, questionCount: exercises.length }
}

export function getAllChapters(): Array<{
  moduleSlug: string
  chapter: CatalogChapter
}> {
  return getCatalog().modules.flatMap((m) =>
    m.chapters.map((chapter) => ({ moduleSlug: m.slug, chapter }))
  )
}

export function getGatePool(mod: CatalogModule): Exercise[] {
  return mod.chapters.flatMap((c) => c.exercises.filter(isAutoGraded))
}

export function getConceptLinks(slug: string): {
  sections: Array<{
    section: CatalogSection
    moduleSlug: string
    moduleTitle: string
    chapterSlug: string
    chapterTitle: string
  }>
  exercises: Exercise[]
} {
  const { modules } = getCatalog()
  const chapters = modules.flatMap((m) => m.chapters.map((c) => ({ m, c })))
  return {
    sections: chapters.flatMap(({ m, c }) =>
      c.sections
        .filter((s) => s.concepts.includes(slug))
        .map((section) => ({
          section,
          moduleSlug: m.slug,
          moduleTitle: m.title,
          chapterSlug: c.slug,
          chapterTitle: c.title,
        }))
    ),
    exercises: chapters.flatMap(({ c }) =>
      c.exercises.filter((e) => isAutoGraded(e) && e.concepts.includes(slug))
    ),
  }
}

export function getConceptInfos(): ConceptInfo[] {
  return getCatalog().concepts.map((concept) => {
    const { sections, exercises } = getConceptLinks(concept.slug)
    return {
      ...concept,
      sectionCount: sections.length,
      exerciseCount: exercises.length,
    }
  })
}

export function getCourseIndex(): CourseIndex {
  const { modules, exams, concepts } = getCatalog()
  return {
    conceptCount: concepts.length,
    exams: exams.map(({ slug, title, durationMinutes }) => ({
      slug,
      title,
      durationMinutes,
    })),
    modules: modules.map((m) => ({
      slug: m.slug,
      order: m.order,
      title: m.title,
      subtitle: m.subtitle,
      description: m.description,
      chapters: m.chapters.map(({ sections, exercises, ...chapter }) => ({
        ...chapter,
        sectionIds: sections.map((s) => s.id),
        exerciseIds: exercises.map((e) => e.id),
      })),
    })),
  }
}
