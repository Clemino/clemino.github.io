import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ExamRun } from "@/components/exam/ExamRun"
import { getCatalog, getExam, getExamInfo } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog().exams.map((e) => ({ partielSlug: e.slug }))
}

export default async function ExamRunPage(props: { params: Promise<{ partielSlug: string }> }) {
  const { partielSlug } = await props.params
  const exam = getExam(partielSlug)
  if (!exam) notFound()

  return (
    <Suspense>
      <ExamRun exam={getExamInfo(exam)} exercises={exam.exercises} />
    </Suspense>
  )
}
