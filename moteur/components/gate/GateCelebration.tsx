"use client"

import { useEffect } from "react"
import { celebrateGate } from "@/lib/confetti"

export function GateCelebration() {
  useEffect(() => {
    celebrateGate()
  }, [])
  return null
}
