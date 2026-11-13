"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProgress } from "@/components/use-progress"
import { nextStepAfterChapter } from "@/lib/progress"

/** Appears once the chapter is complete, so the student never has to look for what comes next. */
export function NextStepButton({ moduleSlug, chapterSlug }: { moduleSlug: string; chapterSlug: string }) {
  const { modules, chapters } = useProgress()
  const mod = modules.find((m) => m.slug === moduleSlug)
  if (!mod || !chapters[chapterSlug]?.completed) return null

  const next = nextStepAfterChapter(mod, chapterSlug)
  return (
    <div className="mt-10 flex justify-end">
      <Button size="lg" asChild>
        <Link href={next.href}>
          {next.label}
          <ArrowRightIcon className="size-4" />
        </Link>
      </Button>
    </div>
  )
}
