import type { ConceptInfo, CourseChapter, CourseIndex } from "@/lib/course"
import { NEW_MASTERY, type Mastery, type ProgressData } from "@/lib/store"

export type ChapterSummary = CourseChapter & {
  unlocked: boolean
  completed: boolean
  sectionsRead: number
  exercisesPassed: number
}

export type ModuleSummary = {
  slug: string
  order: number
  title: string
  subtitle: string | null
  description: string
  unlocked: boolean
  completed: boolean
  exercisesDone: number
  exercisesTotal: number
  bestGateScore: number | null
  chapterCount: number
  sectionCount: number
  chapters: ChapterSummary[]
  chaptersComplete: boolean
}

export type Progress = {
  modules: ModuleSummary[]
  chapters: Record<string, ChapterSummary>
  passedExercises: Set<string>
  masteredCount: number
  conceptCount: number
}

/** The next chapter, or the module's gate once the last chapter is done. */
export function nextStepAfterChapter(
  mod: ModuleSummary,
  chapterSlug: string
): { href: string; label: string } {
  const current = mod.chapters.find((c) => c.slug === chapterSlug)
  const next = mod.chapters.find((c) => c.order === (current?.order ?? 0) + 1)
  return next
    ? { href: `/modules/${mod.slug}/chapter/${next.slug}`, label: "Chapitre suivant" }
    : { href: `/modules/${mod.slug}/gate`, label: "Passer le quiz de validation" }
}

/**
 * Everything derives from the recorded events (sections read, exercises passed,
 * gates passed), which only grow, so unlocks stay acquired without being stored.
 */
export function computeProgress(
  course: CourseIndex,
  data: ProgressData
): Progress {
  const passedExercises = new Set(
    data.attempts
      .filter(
        (a) => a.passed && (a.source === "PRACTICE" || a.source === "SKIP")
      )
      .map((a) => a.exerciseId)
  )

  let previousModuleCompleted = true
  const modules = course.modules.map((m) => {
    let previousChapterCompleted = true
    const chapters = m.chapters.map((c) => {
      const sectionsRead = c.sectionIds.filter(
        (id) => id in data.sectionsRead
      ).length
      const exercisesPassed = c.exerciseIds.filter((id) =>
        passedExercises.has(id)
      ).length
      // An empty chapter never completes: an unwritten module must not validate itself.
      const completed =
        sectionsRead === c.sectionIds.length &&
        exercisesPassed === c.exerciseIds.length &&
        c.sectionIds.length + c.exerciseIds.length > 0
      const unlocked = c.order === 1 || previousChapterCompleted
      // An unwritten chapter must not lock the written ones after it.
      previousChapterCompleted = c.sectionIds.length + c.exerciseIds.length > 0 ? completed : unlocked
      return { ...c, unlocked, completed, sectionsRead, exercisesPassed }
    })

    const gateScores = data.gateRuns.filter(
      (r) => r.moduleSlug === m.slug && r.endedAt
    )
    // A skipped module has a passed gate without score.
    const scores = gateScores.flatMap((r) => (r.score === null ? [] : [r.score]))
    const unlocked = m.order === 1 || previousModuleCompleted
    const completed = gateScores.some((r) => r.passed)
    previousModuleCompleted = completed

    return {
      slug: m.slug,
      order: m.order,
      title: m.title,
      subtitle: m.subtitle,
      description: m.description,
      unlocked,
      completed,
      exercisesDone: chapters.reduce((s, c) => s + c.exercisesPassed, 0),
      exercisesTotal: chapters.reduce((s, c) => s + c.exerciseIds.length, 0),
      bestGateScore: scores.length ? Math.max(...scores) : null,
      chapterCount: chapters.length,
      sectionCount: chapters.reduce((s, c) => s + c.sectionIds.length, 0),
      chapters,
      chaptersComplete:
        chapters.length > 0 && chapters.every((c) => c.completed),
    }
  })

  return {
    modules,
    chapters: Object.fromEntries(
      modules.flatMap((m) => m.chapters.map((c) => [c.slug, c]))
    ),
    passedExercises,
    masteredCount: Object.values(data.mastery).filter((m) => m.reps >= 3)
      .length,
    conceptCount: course.conceptCount,
  }
}

export type DueConcept = { concept: ConceptInfo; mastery: Mastery }

/** Concepts to review, least practiced first. A concept never seen yet is always due. */
export function getDueConcepts(
  concepts: ConceptInfo[],
  mastery: ProgressData["mastery"],
  now: number,
  limit = 30
): DueConcept[] {
  const dueTime = (m: Mastery) => (m.dueAt ? new Date(m.dueAt).getTime() : 0)
  return concepts
    .map((concept) => ({
      concept,
      mastery: mastery[concept.slug] ?? NEW_MASTERY,
    }))
    .filter((c) => dueTime(c.mastery) <= now)
    .sort(
      (a, b) =>
        a.mastery.reps - b.mastery.reps ||
        dueTime(a.mastery) - dueTime(b.mastery)
    )
    .slice(0, limit)
}
