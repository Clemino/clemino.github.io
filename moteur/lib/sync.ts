import type { Session } from "@supabase/supabase-js"
import { toast } from "sonner"
import { COURSE } from "@/content/course"
import { resetAllProgress } from "@/lib/actions/progression"
import { mergeProgress } from "@/lib/merge-progress"
import {
  EMPTY_PROGRESS,
  PROGRESS_KEY,
  useProgressStore,
  type ProgressData,
} from "@/lib/store"
import { supabase } from "@/lib/supabase"

const SYNC_DELAY_MS = 2000
const OWNER_KEY = `${PROGRESS_KEY}-owner`

let userId: string | null = null
let lastSynced = ""
let timer: ReturnType<typeof setTimeout> | undefined

function snapshot(): ProgressData {
  const { attempts, sectionsRead, gateRuns, examRuns, mastery } =
    useProgressStore.getState()
  return { attempts, sectionsRead, gateRuns, examRuns, mastery }
}

const hydrated = () =>
  new Promise<void>((resolve) => {
    if (useProgressStore.persist.hasHydrated()) resolve()
    else useProgressStore.persist.onFinishHydration(() => resolve())
  })

async function save(data: ProgressData) {
  const { error } = await supabase
    .from("progress")
    .upsert({ user_id: userId, course: COURSE.id, data })
  if (error) throw error
}

async function sync() {
  if (!userId) return
  try {
    await hydrated()
    const { data: row, error } = await supabase
      .from("progress")
      .select("data")
      .eq("course", COURSE.id)
      .maybeSingle()
    if (error) throw error
    const merged = mergeProgress(
      snapshot(),
      (row?.data as ProgressData | undefined) ?? EMPTY_PROGRESS
    )
    lastSynced = JSON.stringify(merged)
    useProgressStore.setState(merged)
    await save(merged)
  } catch (error) {
    console.error(error)
    toast.error(
      "Synchronisation impossible : ta progression reste sur cet appareil."
    )
  }
}

function scheduleSync() {
  if (!userId || JSON.stringify(snapshot()) === lastSynced) return
  clearTimeout(timer)
  timer = setTimeout(() => void sync(), SYNC_DELAY_MS)
}

/**
 * Clears progress left by another account, so the next person on this device does not inherit it.
 * Progress made before any sign-in has no owner: it is kept and joins the first account.
 */
async function claimProgress(id: string | null) {
  await hydrated()
  const owner = localStorage.getItem(OWNER_KEY)
  if (owner && owner !== id) resetAllProgress()
  if (id) localStorage.setItem(OWNER_KEY, id)
  else localStorage.removeItem(OWNER_KEY)
}

function onAuthChange(session: Session | null) {
  if (!session) {
    clearTimeout(timer)
    userId = null
    lastSynced = ""
    void claimProgress(null)
  } else if (session.user.id !== userId) {
    userId = session.user.id
    void claimProgress(userId).then(sync)
  }
}

export function startSync() {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    // Supabase calls made inside this callback can deadlock, so they run just after it.
    setTimeout(() => onAuthChange(session))
  })
  const unsubscribe = useProgressStore.subscribe(scheduleSync)
  const onFocus = () => void sync()
  window.addEventListener("focus", onFocus)

  return () => {
    subscription.unsubscribe()
    unsubscribe()
    window.removeEventListener("focus", onFocus)
    clearTimeout(timer)
  }
}

/** A merge would bring the old progress back, so the saved copy is overwritten instead. */
export async function resetProgressEverywhere() {
  resetAllProgress()
  // The reset itself just scheduled a sync, which could merge the old copy back in.
  clearTimeout(timer)
  lastSynced = JSON.stringify(snapshot())
  if (userId) await save(EMPTY_PROGRESS)
}
