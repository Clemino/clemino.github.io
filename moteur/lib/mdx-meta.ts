const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/
const WORDS_PER_MINUTE = 200

export function parseFrontmatter(mdx: string): Record<string, unknown> {
  const m = mdx.match(FRONTMATTER)
  if (!m) return {}
  const meta: Record<string, unknown> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.+)$/)
    if (!kv) continue
    const [, key, raw] = kv
    if (key === "concepts") {
      meta[key] = raw
        .trim()
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    } else if (key === "order" || key === "estimatedReadMin") {
      meta[key] = Number(raw)
    } else {
      meta[key] = raw.trim().replace(/^"|"$/g, "")
    }
  }
  return meta
}

/** Minutes to read the section text; markup such as table rules is not counted as words. */
export function readingMinutes(mdx: string): number {
  const words =
    mdx.replace(FRONTMATTER, "").match(/[\p{L}\p{N}]+/gu)?.length ?? 0
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
