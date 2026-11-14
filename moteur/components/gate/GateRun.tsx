"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useProgress } from "@/components/use-progress"
import { GateRunner } from "@/components/gate/GateRunner"
import type { Exercise } from "@/lib/course"

export function GateRun({
  moduleSlug,
  pool,
  threshold,
}: {
  moduleSlug: string
  pool: Exercise[]
  threshold: number
}) {
  const router = useRouter()
  const runId = useSearchParams().get("run")
  const { data } = useProgress()
  const run = data.gateRuns.find((r) => r.id === runId)
  const exercises = (run?.exerciseIds ?? []).flatMap((id) =>
    pool.filter((e) => e.id === id)
  )

  let redirectTo: string | null = null
  if (data.hydrated) {
    if (!run) redirectTo = `/modules/${moduleSlug}/gate`
    else if (run.endedAt)
      redirectTo = `/modules/${moduleSlug}/gate/result?run=${run.id}`
    else if (exercises.length === 0) redirectTo = `/modules/${moduleSlug}/gate`
  }

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo)
  }, [redirectTo, router])

  if (!run || run.endedAt || exercises.length === 0) return null

  return (
    <GateRunner
      runId={run.id}
      moduleSlug={moduleSlug}
      exercises={exercises}
      threshold={threshold}
    />
  )
}
