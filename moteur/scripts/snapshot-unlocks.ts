/**
 * Records the outline of a published course before content is added to its
 * chapters: chapters unlocked with this outline stay unlocked afterwards
 * (lib/progress.ts). Run it before changing courses/<id>/, then publish.
 *
 *   COURSE=<id> pnpm snapshot:unlocks
 *
 * SNAPSHOT_OUT writes the snapshot to another course folder, to record an
 * outline taken from an older copy of the course.
 */
import fs from "node:fs"
import path from "node:path"
import type { UnlockSnapshot } from "../lib/course"
import { getCourseIndex } from "../lib/catalog"

const course = process.env.COURSE ?? "admin"
const file =
  process.env.SNAPSHOT_OUT ??
  path.join(process.cwd(), "courses", course, "unlock-snapshots.json")

const snapshots: UnlockSnapshot[] = fs.existsSync(file)
  ? JSON.parse(fs.readFileSync(file, "utf8"))
  : []
snapshots.push({
  recordedAt: new Date().toISOString().slice(0, 10),
  modules: getCourseIndex().modules.map((m) => ({
    slug: m.slug,
    chapters: m.chapters.map(({ slug, order, sectionIds, exerciseIds }) => ({
      slug,
      order,
      sectionIds,
      exerciseIds,
    })),
  })),
})
fs.writeFileSync(file, JSON.stringify(snapshots, null, 1))
console.log(
  `${path.relative(process.cwd(), file)} : ${snapshots.length} plan(s) figé(s)`
)
