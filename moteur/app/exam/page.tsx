import { ExamIndexView } from "@/components/exam/ExamIndexView"
import { getCatalog, getExamInfo } from "@/lib/catalog"

export default function ExamIndexPage() {
  return <ExamIndexView exams={getCatalog().exams.map(getExamInfo)} />
}
