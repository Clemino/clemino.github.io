"use client"

import { useState } from "react"
import { AlertTriangleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { resetProgressEverywhere } from "@/lib/sync"
import { toast } from "sonner"

export function ResetProgressButton() {
  const [confirm, setConfirm] = useState(false)

  if (!confirm) {
    return (
      <Button variant="destructive" onClick={() => setConfirm(true)}>
        <AlertTriangleIcon className="size-4" />
        Réinitialiser ma progression
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-[var(--warning)]">
        Confirmer ?
      </span>
      <Button variant="outline" onClick={() => setConfirm(false)}>
        Annuler
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          setConfirm(false)
          resetProgressEverywhere().then(
            () => toast.success("Progression réinitialisée"),
            () => toast.error("Réinitialisation incomplète : réessaie une fois connecté à internet."),
          )
        }}
      >
        Oui, tout réinitialiser
      </Button>
    </div>
  )
}
