/**
 * Simple fuzzy match: query terms (space-separated) must each appear in order in the haystack.
 * Case-insensitive. Returns a boolean; for scoring/sorting, callers can use multiple fields.
 */
export function fuzzyMatch(haystack: string, query: string): boolean {
  const h = haystack.toLowerCase()
  const terms = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (terms.length === 0) return true
  let idx = 0
  for (const term of terms) {
    const i = h.indexOf(term, idx)
    if (i === -1) return false
    idx = i + term.length
  }
  return true
}

/**
 * Score for sorting: higher = better match. Uses same term-order match; boosts if term at word start.
 */
export function fuzzyScore(haystack: string, query: string): number {
  const h = haystack.toLowerCase()
  const terms = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (terms.length === 0) return 1
  let idx = 0
  let score = 0
  for (const term of terms) {
    const i = h.indexOf(term, idx)
    if (i === -1) return 0
    const atWordStart = i === 0 || /[\s\-_]/.test(h[i - 1] ?? '')
    score += atWordStart ? 2 : 1
    idx = i + term.length
  }
  return score
}
