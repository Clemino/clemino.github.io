import { createClient } from "@supabase/supabase-js"

// Both values are public by design: access is enforced by the database policies.
const SUPABASE_URL = "https://fcxrvoloiuicbgbqjoco.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_c9upHMOOf7Zi_m1xpy_seQ_t3uLZVTG"

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { flowType: "pkce" },
})
