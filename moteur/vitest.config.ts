import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", testTimeout: 30000 },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
})
