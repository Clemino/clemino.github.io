"use client"

import confetti from "canvas-confetti"

// Lime-themed confetti for successful validations.
export function celebratePass() {
  if (typeof window === "undefined") return
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reducedMotion) return

  const colors = ["#bef264", "#a3e635", "#84cc16", "#dde6f8"]

  confetti({
    particleCount: 60,
    spread: 70,
    origin: { x: 0.5, y: 0.4 },
    colors,
    ticks: 180,
    scalar: 0.9,
  })

  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 45,
      origin: { x: 0, y: 0.6 },
      colors,
      ticks: 180,
      scalar: 0.7,
    })
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 45,
      origin: { x: 1, y: 0.6 },
      colors,
      ticks: 180,
      scalar: 0.7,
    })
  }, 180)
}

export function celebrateGate() {
  if (typeof window === "undefined") return
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reducedMotion) return

  const colors = ["#bef264", "#a3e635", "#84cc16", "#65a30d"]
  const duration = 1200
  const end = Date.now() + duration
  ;(function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}
