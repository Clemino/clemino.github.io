"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CheckIcon } from "lucide-react"
import { useProgress } from "@/components/use-progress"
import { Button } from "@/components/ui/button"
import { markSectionRead } from "@/lib/actions/progression"

export function MarkReadButton({
  sectionId,
  nextHref,
  exercisesHref,
}: {
  sectionId: string
  nextHref: string
  exercisesHref: string
}) {
  const router = useRouter()
  const { data } = useProgress()
  // Set when the student came from a question: "J'ai compris" takes them back to it.
  const exerciseId = useSearchParams().get("exercice")

  if (exerciseId) {
    return (
      <Button
        onClick={() => {
          markSectionRead(sectionId)
          router.push(`${exercisesHref}/${exerciseId}`)
        }}
      >
        <CheckIcon className="size-4" /> J&apos;ai compris
      </Button>
    )
  }

  if (sectionId in data.sectionsRead) {
    return (
      <Button onClick={() => router.push(nextHref)}>
        <CheckIcon className="size-4" /> Compris, suivant
      </Button>
    )
  }

  return (
    <Button
      onClick={() => {
        markSectionRead(sectionId)
        router.push(nextHref)
      }}
    >
      <CheckIcon className="size-4" />
      Je comprends
    </Button>
  )
}
