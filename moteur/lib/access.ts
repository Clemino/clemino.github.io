import { COURSE } from "@/content/course"
import { supabase } from "@/lib/supabase"

/** Only people signed in who follow this course can use it. */
export async function canOpenCourse(): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return false
  const { data, error } = await supabase.from("followed_courses").select("course").eq("course", COURSE.id).maybeSingle()
  // A network failure must not lock someone out of a course they follow.
  return error !== null || data !== null
}
