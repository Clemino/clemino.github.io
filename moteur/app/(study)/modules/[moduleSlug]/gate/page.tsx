import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, FlagIcon } from "lucide-react"
import { BestGateScore } from "@/components/gate/BestGateScore"
import { StartGateButton } from "@/components/gate/StartGateButton"
import { AccessGuard } from "@/components/study/AccessGuard"
import { getCatalog, getModule } from "@/lib/catalog"
import { GATE_SIZE } from "@/lib/course"

export function generateStaticParams() {
  return getCatalog().modules.map((m) => ({ moduleSlug: m.slug }))
}

export default async function GatePage(props: { params: Promise<{ moduleSlug: string }> }) {
  const { moduleSlug } = await props.params
  const mod = getModule(moduleSlug)
  if (!mod) notFound()

  return (
    <AccessGuard moduleSlug={moduleSlug} requireChapters>
    <div className="mx-auto max-w-3xl px-8 py-16 text-center">
      <Link href={`/modules/${moduleSlug}`} className="mono-label inline-flex items-center gap-1 hover:text-[var(--fg-0)]">
        <ArrowLeftIcon className="size-3" /> {mod.title}
      </Link>

      <div className="mx-auto mt-12 inline-flex size-16 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent-dim)]/30">
        <FlagIcon className="size-7 text-[var(--accent)]" />
      </div>

      <h1 className="mt-8 font-mono text-3xl tracking-tight">Quiz de validation</h1>
      <p className="mt-3 text-sm text-[var(--fg-2)]">
        {GATE_SIZE} questions tirées au hasard dans le module · seuil 80 % pour débloquer le module suivant
      </p>

      <div className="mt-10 grid grid-cols-3 gap-3 text-left">
        <div className="card-elevated p-4">
          <div className="mono-label">Format</div>
          <div className="mt-1 text-sm">Mix de tous types : QCM, vrai ou faux, associations, cas guidés…</div>
        </div>
        <div className="card-elevated p-4">
          <div className="mono-label">Score requis</div>
          <div className="mt-1 text-sm">≥ 80 % pour valider</div>
        </div>
        <div className="card-elevated p-4">
          <div className="mono-label">Réessayer</div>
          <div className="mt-1 text-sm">Autant que nécessaire</div>
        </div>
      </div>

      <BestGateScore moduleSlug={moduleSlug} />

      <div className="mt-10">
        <StartGateButton moduleSlug={moduleSlug} poolIds={mod.gatePoolIds} />
      </div>
    </div>
    </AccessGuard>
  )
}
