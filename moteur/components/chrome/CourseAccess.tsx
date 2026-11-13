"use client"

import { useEffect } from "react"
import { canOpenCourse } from "@/lib/access"
import { supabase } from "@/lib/supabase"

const leave = () => window.location.replace("/cours/")

/** Sends people back to the library when this course is not theirs. */
export function CourseAccess() {
  useEffect(() => {
    // The library is a separate page: it does not exist under pnpm dev.
    if (process.env.NODE_ENV !== "production") return
    void canOpenCourse().then((allowed) => {
      if (!allowed) leave()
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") leave()
    })
    return () => subscription.unsubscribe()
  }, [])

  return null
}
