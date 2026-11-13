import { Suspense } from "react"
import { notFound } from "next/navigation"
import { GateRun } from "@/components/gate/GateRun"
import { AccessGuard } from "@/components/study/AccessGuard"
import { GATE_THRESHOLD, getCatalog, getGatePool, getModule } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog().modules.map((m) => ({ moduleSlug: m.slug }))
}

export default async function GateRunPage(props: { params: Promise<{ moduleSlug: string }> }) {
  const { moduleSlug } = await props.params
  const mod = getModule(moduleSlug)
  if (!mod) notFound()

  return (
    <AccessGuard moduleSlug={moduleSlug}>
      <Suspense>
        <GateRun moduleSlug={moduleSlug} pool={getGatePool(mod)} threshold={GATE_THRESHOLD} />
      </Suspense>
    </AccessGuard>
  )
}
