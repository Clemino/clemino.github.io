import type {
  AnyPayload,
  AnySolution,
  ExerciseType,
} from "@/lib/validators/types"

export type Exercise = {
  id: string
  moduleSlug: string
  chapterSlug: string
  type: ExerciseType
  difficulty: number
  points: number
  prompt: string
  payload: AnyPayload
  solution: AnySolution
  explanation: string
  hint: string | null
  concepts: string[]
  source: string | null
}

export const GATE_SIZE = 15

export const EXERCISE_LABELS: Record<ExerciseType, string> = {
  MCQ_SINGLE: "QCM",
  MCQ_MULTI: "QCM multiple",
  TRUE_FALSE: "Vrai ou faux",
  FILL_BLANK: "Texte à trous",
  ORDERING: "Remise en ordre",
  MATCHING: "Association",
  CASE_STUDY: "Cas pratique guidé",
  WRITING: "Rédaction",
  PREDICT_OUTPUT: "Prédire la sortie",
  NUMERIC: "Calcul",
  ALGO_TRACE: "Trace d'algorithme",
  CODE_ANALYSIS: "Analyse de code",
  FIGURE_INTERPRET: "Lecture de figure",
  PETRI_ENABLED_TRANSITIONS: "Transitions franchissables",
  PETRI_FIRE_SEQUENCE: "Séquence de tir",
  PETRI_MATRIX: "Matrice d'incidence",
  PETRI_PROPERTY: "Propriété du réseau",
  PETRI_INVARIANT: "Invariant",
  PETRI_REACHABILITY: "Accessibilité",
  CODE_WRITE: "Écrire le code",
  CODE_FIX: "Corriger le code",
  SQL_DDL: "Création de table",
  PLSQL_BLOCK: "Bloc PL/SQL",
  PLSQL_TRIGGER: "Trigger",
  PLSQL_PROCEDURE: "Procédure",
  TRACE_EXECUTION: "Trace d'exécution",
  RUBRIC_OPEN: "Question ouverte",
  CHART_READ: "Lecture de graphique",
  TRADE_PLAN: "Plan de trade",
}

/** These answers are checked by the student against a reference, not by the site. */
export const isSelfGraded = (type: ExerciseType) =>
  type === "WRITING" || type === "CODE_WRITE" || type === "CODE_FIX"

export type CourseChapter = {
  slug: string
  order: number
  title: string
  sectionIds: string[]
  exerciseIds: string[]
}

export type CourseModule = {
  slug: string
  order: number
  title: string
  subtitle: string | null
  description: string
  chapters: CourseChapter[]
}

/** Lightweight course outline shared with every page to compute progress in the browser. */
export type CourseIndex = {
  modules: CourseModule[]
  exams: Pick<ExamInfo, "slug" | "title" | "durationMinutes">[]
  conceptCount: number
}

export type ExamInfo = {
  slug: string
  title: string
  description: string
  durationMinutes: number
  totalPoints: number
  questionCount: number
}

export type ConceptInfo = {
  slug: string
  label: string
  summary: string | null
  sectionCount: number
  exerciseCount: number
}
