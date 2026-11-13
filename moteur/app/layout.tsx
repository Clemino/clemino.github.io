import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { CourseAccess } from "@/components/chrome/CourseAccess"
import { ThemeProvider } from "@/components/theme-provider"
import { COURSE } from "@/content/course"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CommandPalette } from "@/components/chrome/CommandPalette"
import { ProgressHydrator } from "@/components/use-progress"
import { cn } from "@/lib/utils"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" })

export const metadata: Metadata = {
  title: COURSE.title,
  description: COURSE.description,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning className={cn(geistSans.variable, geistMono.variable)}>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <CourseAccess />
          <ProgressHydrator />
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <CommandPalette />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
