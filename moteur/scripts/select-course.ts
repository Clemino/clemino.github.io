/**
 * Copies courses/<COURSE> to content/, the folder the engine reads.
 * Runs automatically before `pnpm dev`, `pnpm build` and `pnpm test`.
 */
import fs from "node:fs"
import path from "node:path"

const course = process.env.COURSE ?? "admin"
const source = path.join(process.cwd(), "courses", course)
const target = path.join(process.cwd(), "content")

if (!fs.existsSync(source)) throw new Error(`Unknown course: ${course}`)
fs.rmSync(target, { recursive: true, force: true })
fs.cpSync(source, target, { recursive: true })
