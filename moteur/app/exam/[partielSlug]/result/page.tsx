import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ExamResult } from "@/components/exam/ExamResult"
import { getCatalog, getExam, getExamInfo } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog().exams.map((e) => ({ partielSlug: e.slug }))
}

export default async function ExamResultPage(props: {
  params: Promise<{ partielSlug: string }>
}) {
  const { partielSlug } = await props.params
  const exam = getExam(partielSlug)
  if (!exam) notFound()

  return (
    <Suspense>
      <ExamResult exam={getExamInfo(exam)} exercises={exam.exercises} />
    </Suspense>
  )
}
