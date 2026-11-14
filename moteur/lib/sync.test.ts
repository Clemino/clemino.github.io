import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { EMPTY_PROGRESS, useProgressStore, type Attempt } from "@/lib/store"
import { resetProgressEverywhere, startSync } from "./sync"

const db = vi.hoisted(() => ({
  row: null as { data: unknown } | null,
  saved: [] as { user_id: string; data: { attempts: unknown[] } }[],
  authCallback: (() => {}) as (event: string, session: unknown) => void,
}))

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }))
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (callback: typeof db.authCallback) => {
        db.authCallback = callback
        return { data: { subscription: { unsubscribe: vi.fn() } } }
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: db.row, error: null }),
        }),
      }),
      upsert: async (value: (typeof db.saved)[number]) => {
        db.saved.push(value)
        return { error: null }
      },
    }),
  },
}))

const attempt = (exerciseId: string): Attempt => ({
  exerciseId,
  score: 1,
  passed: true,
  source: "PRACTICE",
  createdAt: `2026-01-01T00:00:0${exerciseId}`,
})
const attemptIds = () =>
  useProgressStore.getState().attempts.map((a) => a.exerciseId)

describe("progress sync", () => {
  let stop: () => void
  const signIn = async (id: string) => {
    db.authCallback("SIGNED_IN", { user: { id } })
    await vi.runAllTimersAsync()
  }

  beforeEach(async () => {
    vi.useFakeTimers()
    await useProgressStore.persist.rehydrate()
    useProgressStore.setState({ ...EMPTY_PROGRESS, hydrated: true })
    db.row = null
    db.saved = []
    stop = startSync()
  })

  afterEach(async () => {
    db.authCallback("SIGNED_OUT", null)
    await vi.runAllTimersAsync()
    stop()
    vi.useRealTimers()
  })

  it("merges the saved progress with this device on sign-in", async () => {
    useProgressStore.setState({ attempts: [attempt("1")] })
    db.row = { data: { ...EMPTY_PROGRESS, attempts: [attempt("2")] } }
    await signIn("user-a")
    expect(attemptIds()).toEqual(["1", "2"])
    expect(db.saved.at(-1)?.user_id).toBe("user-a")
    expect(db.saved.at(-1)?.data.attempts).toHaveLength(2)
  })

  it("saves new progress shortly after it happens", async () => {
    await signIn("user-a")
    db.saved = []
    useProgressStore.setState({ attempts: [attempt("3")] })
    await vi.runAllTimersAsync()
    expect(db.saved.at(-1)?.data.attempts).toHaveLength(1)
  })

  it("leaves nothing behind for the next person after sign-out", async () => {
    db.row = { data: { ...EMPTY_PROGRESS, attempts: [attempt("1")] } }
    await signIn("user-a")
    db.authCallback("SIGNED_OUT", null)
    await vi.runAllTimersAsync()
    expect(attemptIds()).toEqual([])
  })

  it("keeps progress made before any sign-in", async () => {
    useProgressStore.setState({ attempts: [attempt("1")] })
    db.authCallback("INITIAL_SESSION", null)
    await vi.runAllTimersAsync()
    expect(attemptIds()).toEqual(["1"])
    await signIn("user-a")
    expect(db.saved.at(-1)?.data.attempts).toHaveLength(1)
  })

  it("clears the previous account's progress when another account arrives", async () => {
    await signIn("user-a")
    useProgressStore.setState({ attempts: [attempt("1")] })
    await vi.runAllTimersAsync()
    stop()
    stop = startSync()
    await signIn("user-b")
    expect(attemptIds()).toEqual([])
    expect(db.saved.at(-1)?.user_id).toBe("user-b")
  })

  it("clears the account's progress when it signed out from another page", async () => {
    await signIn("user-a")
    useProgressStore.setState({ attempts: [attempt("1")] })
    await vi.runAllTimersAsync()
    stop()
    stop = startSync()
    db.authCallback("INITIAL_SESSION", null)
    await vi.runAllTimersAsync()
    expect(attemptIds()).toEqual([])
  })

  it("does not save anything when nobody is signed in", async () => {
    useProgressStore.setState({ attempts: [attempt("1")] })
    await vi.runAllTimersAsync()
    expect(db.saved).toEqual([])
  })

  it("does not bring progress back after a reset", async () => {
    db.row = { data: { ...EMPTY_PROGRESS, attempts: [attempt("1")] } }
    await signIn("user-a")
    await resetProgressEverywhere()
    await vi.runAllTimersAsync()
    expect(attemptIds()).toEqual([])
    expect(db.saved.at(-1)?.data.attempts).toEqual([])
  })
})
