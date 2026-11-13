"use client"

import { useEffect, useMemo } from "react"
import courseIndex from "@/lib/generated/course-index.json"
import { computeProgress } from "@/lib/progress"
import { PROGRESS_KEY, useProgressStore } from "@/lib/store"
import { startSync } from "@/lib/sync"

export function ProgressHydrator() {
  useEffect(() => {
    void useProgressStore.persist.rehydrate()
    // Another tab may have written newer progress; without this, the next write here would erase it.
    const onStorage = (e: StorageEvent) => {
      if (e.key === PROGRESS_KEY) void useProgressStore.persist.rehydrate()
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  useEffect(() => startSync(), [])

  return null
}

export function useProgress() {
  const data = useProgressStore()
  return useMemo(
    () => ({ ...computeProgress(courseIndex, data), data }),
    [data]
  )
}
