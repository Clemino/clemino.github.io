import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import { CourseAccess } from "@/components/chrome/CourseAccess"
import { ThemeProvider } from "@/components/theme-provider"
import { COURSE } from "@/content/course"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CommandPalette } from "@/components/chrome/CommandPalette"
import { MobileNav } from "@/components/chrome/MobileNav"
import { ProgressHydrator } from "@/components/use-progress"
import { cn } from "@/lib/utils"

// Local files: the build must not depend on Google Fonts being reachable.
const geistSans = localFont({
  src: "./fonts/geist.woff2",
  weight: "100 900",
  variable: "--font-geist-sans",
  display: "swap",
})
const geistMono = localFont({
  src: "./fonts/geist-mono.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: COURSE.title,
  description: COURSE.description,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn(geistSans.variable, geistMono.variable)}
    >
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CourseAccess />
          <ProgressHydrator />
          <MobileNav />
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <CommandPalette />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
