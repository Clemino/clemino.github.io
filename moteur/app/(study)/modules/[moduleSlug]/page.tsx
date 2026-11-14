import { notFound } from "next/navigation"
import { AccessGuard } from "@/components/study/AccessGuard"
import { ModuleView } from "@/components/study/ModuleView"
import { getCatalog, getModule } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog().modules.map((m) => ({ moduleSlug: m.slug }))
}

export default async function ModulePage(props: {
  params: Promise<{ moduleSlug: string }>
}) {
  const { moduleSlug } = await props.params
  if (!getModule(moduleSlug)) notFound()

  return (
    <AccessGuard moduleSlug={moduleSlug}>
      <ModuleView moduleSlug={moduleSlug} />
    </AccessGuard>
  )
}
