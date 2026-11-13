import { ModuleSidebar } from "@/components/study/ModuleSidebar"

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <ModuleSidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  )
}
