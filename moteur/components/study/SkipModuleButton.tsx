"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SkipForwardIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useProgress } from "@/components/use-progress"
import { skipModule } from "@/lib/actions/progression"

export function SkipModuleButton({ moduleSlug }: { moduleSlug: string }) {
  const router = useRouter()
  const { modules } = useProgress()
  const [confirm, setConfirm] = useState(false)

  const index = modules.findIndex((m) => m.slug === moduleSlug)
  const mod = modules[index]
  const next = modules[index + 1]
  if (!mod || mod.completed) return null

  return (
    <div className="card-elevated mt-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-sm">Sauter ce module</div>
          <p className="text-xs text-[var(--fg-2)]">
            Valide la théorie, les exercices et le gate sans les faire, et
            débloque le module suivant.
          </p>
        </div>
        {confirm ? (
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-mono text-xs text-[var(--warning)]">
              Confirmer ?
            </span>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                skipModule(mod)
                toast.success("Module validé")
                router.push(next ? `/modules/${next.slug}` : "/modules")
              }}
            >
              Oui, valider le module
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => setConfirm(true)}
          >
            <SkipForwardIcon className="size-4" />
            Sauter
          </Button>
        )}
      </div>
    </div>
  )
}
