import { Suspense } from "react"
import { notFound } from "next/navigation"
import { GateResult } from "@/components/gate/GateResult"
import { AccessGuard } from "@/components/study/AccessGuard"
import { getCatalog, getGatePool, getModule } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog().modules.map((m) => ({ moduleSlug: m.slug }))
}

export default async function GateResultPage(props: {
  params: Promise<{ moduleSlug: string }>
}) {
  const { moduleSlug } = await props.params
  const mod = getModule(moduleSlug)
  if (!mod) notFound()

  return (
    <AccessGuard moduleSlug={moduleSlug}>
      <Suspense>
        <GateResult moduleSlug={moduleSlug} pool={getGatePool(mod)} />
      </Suspense>
    </AccessGuard>
  )
}
