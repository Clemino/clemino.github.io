/**
 * Writes the course outline used in the browser. Importing it from a client
 * module keeps it in one cached chunk instead of repeating it in every page.
 * Runs automatically before `pnpm dev` and `pnpm build`.
 */
import fs from "node:fs"
import path from "node:path"
import { getCourseIndex } from "../lib/catalog"

const file = path.join(process.cwd(), "lib", "generated", "course-index.json")
fs.mkdirSync(path.dirname(file), { recursive: true })
fs.writeFileSync(file, JSON.stringify(getCourseIndex()))
