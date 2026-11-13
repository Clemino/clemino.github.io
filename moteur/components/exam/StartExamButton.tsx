"use client"

import { useRouter } from "next/navigation"
import { PlayIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { startExamRun } from "@/lib/actions/exam"

export function StartExamButton({ examSlug }: { examSlug: string }) {
  const router = useRouter()

  return (
    <Button
      size="lg"
      onClick={() =>
        router.push(`/exam/${examSlug}/run?run=${startExamRun(examSlug)}`)
      }
    >
      <PlayIcon className="size-4" />
      {"Démarrer l'examen"}
    </Button>
  )
}
