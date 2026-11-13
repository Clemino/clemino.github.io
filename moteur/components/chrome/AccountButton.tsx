"use client"

import { useEffect, useState } from "react"
import { LogInIcon, LogOutIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export function AccountButton() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setEmail(session?.user.email ?? null))
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    })
    if (error) toast.error("Connexion impossible. Réessaie dans un instant.")
  }

  if (email) {
    return (
      <Button variant="ghost" size="sm" onClick={() => void supabase.auth.signOut({ scope: "local" })} title={email}>
        <LogOutIcon className="size-3.5" />
        Se déconnecter
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => void signIn()}>
      <LogInIcon className="size-3.5" />
      Se connecter
    </Button>
  )
}
