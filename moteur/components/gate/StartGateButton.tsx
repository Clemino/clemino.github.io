"use client"

import { useRouter } from "next/navigation"
import { PlayIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { startGateRun } from "@/lib/actions/progression"

export function StartGateButton({
  moduleSlug,
  poolIds,
}: {
  moduleSlug: string
  poolIds: string[]
}) {
  const router = useRouter()

  return (
    <Button
      size="lg"
      onClick={() =>
        router.push(
          `/modules/${moduleSlug}/gate/run?run=${startGateRun(moduleSlug, poolIds)}`
        )
      }
    >
      <PlayIcon className="size-4" />
      Lancer le quiz
    </Button>
  )
}
