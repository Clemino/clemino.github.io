import Link from "next/link"
import { ModuleSidebar } from "@/components/study/ModuleSidebar"
import { ResetProgressButton } from "@/components/study/ResetProgressButton"
import { COURSE } from "@/content/course"

export default async function SettingsPage() {
  return (
    <div className="flex min-h-svh">
      <ModuleSidebar />
      <main className="mx-auto max-w-3xl px-8 py-12">
        <Link href="/" className="mono-label hover:text-[var(--fg-0)]">← accueil</Link>
        <h1 className="mt-3 font-mono text-3xl tracking-tight">Réglages</h1>

        <section className="mt-10 card-elevated p-5">
          <div className="font-mono text-sm">Apparence</div>
          <p className="mt-1 text-xs text-[var(--fg-2)]">
            Appuie sur <kbd className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-1.5 py-0.5 font-mono text-[10px]">d</kbd> pour basculer entre thème clair et sombre.
          </p>
        </section>

        <section className="mt-4 card-elevated p-5">
          <div className="font-mono text-sm">Progression</div>
          <p className="mt-1 text-xs text-[var(--fg-2)]">
            Réinitialise toute la progression : exercices, gates, lectures, maîtrise des concepts. Le contenu (théorie, exercices) reste intact.
          </p>
          <div className="mt-3 flex gap-2">
            <ResetProgressButton />
          </div>
        </section>

        <section className="mt-4 card-elevated p-5">
          <div className="font-mono text-sm">À propos</div>
          <p className="mt-1 text-xs text-[var(--fg-2)]">
            {COURSE.about}
          </p>
        </section>
      </main>
    </div>
  )
}
