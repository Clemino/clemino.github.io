"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProgress } from "@/components/use-progress"

/** Sends the student back when the page is still locked. Waits for stored progress first. */
export function AccessGuard({
  moduleSlug,
  chapterSlug,
  requireChapters,
  children,
}: {
  moduleSlug: string
  chapterSlug?: string
  requireChapters?: boolean
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data, modules, chapters } = useProgress()
  const mod = modules.find((m) => m.slug === moduleSlug)

  let redirectTo: string | null = null
  if (data.hydrated) {
    if (!mod?.unlocked) redirectTo = "/modules"
    else if (chapterSlug && !chapters[chapterSlug]?.unlocked)
      redirectTo = `/modules/${moduleSlug}`
    else if (requireChapters && !mod.chaptersComplete)
      redirectTo = `/modules/${moduleSlug}`
  }

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo)
  }, [redirectTo, router])

  return redirectTo ? null : children
}
