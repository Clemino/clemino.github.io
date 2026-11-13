/** Normalize a string for comparison: trim, lowercase (optional), strip accents (optional). */
export function normalize(
  s: string,
  opts: { caseSensitive?: boolean; stripAccents?: boolean } = {}
): string {
  let out = String(s ?? "").trim()
  if (!opts.caseSensitive) out = out.toLocaleLowerCase("fr")
  if (opts.stripAccents !== false) {
    out = out.normalize("NFD").replace(/[̀-ͯ]/g, "")
  }
  // collapse internal whitespace
  out = out.replace(/\s+/g, " ")
  return out
}

/** Boolean set equality */
export function setsEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  const sa = new Set(a)
  for (const x of b) if (!sa.has(x)) return false
  return true
}

/** Approximate text equality with tolerance */
export function approxEqual(
  a: string,
  b: string,
  opts: { tolerance?: number; caseSensitive?: boolean; stripAccents?: boolean } = {}
): boolean {
  const tolerance = opts.tolerance ?? 0
  const na = normalize(a, opts)
  const nb = normalize(b, opts)
  if (na === nb) return true
  if (tolerance > 0) {
    const d = levenshtein(na, nb)
    return d <= tolerance
  }
  return false
}

/** Count word occurrences for keyword-presence checks */
export function containsWord(haystack: string, needle: string): boolean {
  const h = normalize(haystack)
  const n = normalize(needle)
  if (!n) return false
  const escaped = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`(^|\\W)${escaped}(\\W|$)`, "i").test(h)
}

/** Levenshtein distance for fuzzy comparison */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const m = a.length
  const n = b.length
  const prev = new Array(n + 1).fill(0).map((_, i) => i)
  const curr = new Array(n + 1).fill(0)
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j]
  }
  return prev[n]
}

export function numericMatch(
  x: number,
  target: number,
  opts: { absTol?: number; relTol?: number } = {}
): boolean {
  const diff = Math.abs(x - target)
  if (diff <= (opts.absTol ?? 0)) return true
  if (opts.relTol !== undefined && diff <= opts.relTol * Math.abs(target)) return true
  return false
}
