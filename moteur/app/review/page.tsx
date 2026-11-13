import { ReviewView } from "@/components/study/ReviewView"
import { getConceptInfos } from "@/lib/catalog"

export default function ReviewIndexPage() {
  return <ReviewView concepts={getConceptInfos()} />
}
