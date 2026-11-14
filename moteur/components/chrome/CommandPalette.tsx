"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Command } from "cmdk"
import {
  BookOpenIcon,
  CommandIcon,
  FileTextIcon,
  FlagIcon,
  LayersIcon,
  RepeatIcon,
  SettingsIcon,
  SunIcon,
  TrophyIcon,
} from "lucide-react"
import { useProgress } from "@/components/use-progress"
import courseIndex from "@/lib/generated/course-index.json"
import { cn } from "@/lib/utils"

type CmdNavItem = {
  id: string
  label: string
  hint?: string
  href: string
  icon?: React.ReactNode
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { modules } = useProgress()

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        const target = e.target as HTMLElement
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable)
        ) {
          if (e.key === "/") return
        }
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const navigate = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const grouped = React.useMemo(() => {
    const g: Record<"modules" | "chapters" | "exams", CmdNavItem[]> = {
      modules: [],
      chapters: [],
      exams: [],
    }
    for (const m of modules) {
      if (!m.unlocked) continue
      g.modules.push({
        id: `mod-${m.slug}`,
        label: m.title,
        hint: `Module ${m.order}`,
        href: `/modules/${m.slug}`,
      })
      for (const c of m.chapters) {
        g.chapters.push({
          id: `ch-${c.slug}`,
          label: c.title,
          hint: m.title,
          href: `/modules/${m.slug}/chapter/${c.slug}`,
        })
      }
    }
    for (const e of courseIndex.exams) {
      g.exams.push({
        id: `ex-${e.slug}`,
        label: e.title,
        hint: `${e.durationMinutes} min`,
        href: `/exam/${e.slug}`,
      })
    }
    return g
  }, [modules])

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le palette de commandes"
        className="fixed right-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-3 py-2 font-mono text-xs text-[var(--fg-2)] shadow-md hover:bg-[var(--bg-2)]"
      >
        <CommandIcon className="size-3.5" />
        <span>K</span>
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden
      />
      <div
        className={cn(
          "relative w-full max-w-xl overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--bg-1)] shadow-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command palette" className="flex flex-col">
          <Command.Input
            placeholder="Tape pour chercher un module, chapitre, partiel..."
            className="w-full border-b border-[var(--border)] bg-transparent px-4 py-3 text-sm placeholder:text-[var(--fg-3)] focus:outline-none"
            autoFocus
          />
          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="px-4 py-6 text-center text-xs text-[var(--fg-2)]">
              Aucun résultat.
            </Command.Empty>

            {grouped.modules.length > 0 && (
              <Command.Group heading="Modules" className="mb-2">
                <CmdGroupHeading icon={<LayersIcon className="size-3" />}>
                  Modules
                </CmdGroupHeading>
                {grouped.modules.map((it) => (
                  <CmdItem
                    key={it.id}
                    value={it.label}
                    onSelect={() => navigate(it.href)}
                    icon={it.icon ?? <LayersIcon className="size-3.5" />}
                    label={it.label}
                    hint={it.hint}
                  />
                ))}
              </Command.Group>
            )}

            {grouped.chapters.length > 0 && (
              <Command.Group heading="Chapitres">
                <CmdGroupHeading icon={<BookOpenIcon className="size-3" />}>
                  Chapitres
                </CmdGroupHeading>
                {grouped.chapters.map((it) => (
                  <CmdItem
                    key={it.id}
                    value={`${it.label} ${it.hint ?? ""}`}
                    onSelect={() => navigate(it.href)}
                    icon={<FileTextIcon className="size-3.5" />}
                    label={it.label}
                    hint={it.hint}
                  />
                ))}
              </Command.Group>
            )}

            {grouped.exams.length > 0 && (
              <Command.Group heading="Partiels">
                <CmdGroupHeading icon={<FlagIcon className="size-3" />}>
                  Partiels
                </CmdGroupHeading>
                {grouped.exams.map((it) => (
                  <CmdItem
                    key={it.id}
                    value={it.label}
                    onSelect={() => navigate(it.href)}
                    icon={<TrophyIcon className="size-3.5" />}
                    label={it.label}
                    hint={it.hint}
                  />
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Actions">
              <CmdGroupHeading icon={<SettingsIcon className="size-3" />}>
                Actions
              </CmdGroupHeading>
              <CmdItem
                value="revision review concepts"
                onSelect={() => navigate("/review")}
                icon={<RepeatIcon className="size-3.5" />}
                label="Révision"
                hint="/review"
              />
              <CmdItem
                value="stats statistiques"
                onSelect={() => navigate("/stats")}
                icon={<TrophyIcon className="size-3.5" />}
                label="Statistiques"
                hint="/stats"
              />
              <CmdItem
                value="settings réglages"
                onSelect={() => navigate("/settings")}
                icon={<SettingsIcon className="size-3.5" />}
                label="Réglages"
                hint="/settings"
              />
              <CmdItem
                value="theme dark light toggle thème"
                onSelect={() => {
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  setOpen(false)
                }}
                icon={<SunIcon className="size-3.5" />}
                label={`Basculer en mode ${resolvedTheme === "dark" ? "clair" : "sombre"}`}
                hint="d"
              />
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg-0)] px-4 py-2 font-mono text-[10px] text-[var(--fg-3)]">
            <span>↑↓ naviguer · ↵ valider</span>
            <span>
              <kbd className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-1 py-0.5">
                esc
              </kbd>{" "}
              fermer
            </span>
          </div>
        </Command>
      </div>
    </div>
  )
}

function CmdGroupHeading({
  children,
  icon,
}: {
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] tracking-widest text-[var(--fg-3)] uppercase">
      {icon}
      {children}
    </div>
  )
}

function CmdItem({
  value,
  onSelect,
  icon,
  label,
  hint,
}: {
  value: string
  onSelect: () => void
  icon: React.ReactNode
  label: string
  hint?: string
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
        "data-[selected=true]:bg-[var(--accent)] data-[selected=true]:text-[var(--accent-fg)]"
      )}
    >
      <span className="text-[var(--fg-2)] data-[selected=true]:text-[var(--accent-fg)]">
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {hint && (
        <span className="font-mono text-[10px] text-[var(--fg-3)] data-[selected=true]:text-[var(--accent-fg)]/80">
          {hint}
        </span>
      )}
    </Command.Item>
  )
}
