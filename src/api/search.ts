import { apiGet } from '@/lib/api'
import { fuzzyMatch, fuzzyScore } from '@/lib/fuzzy'
import type {
  GlobalSearchFilters,
  GlobalSearchResponse,
  SearchResult,
  SearchResultKind,
} from '@/types/search'

/** Mock data for client-side search when no backend search is available */
const MOCK_REPOS: SearchResult[] = [
  { id: 'r1', kind: 'repo', title: 'atlas-app', fullName: 'org/atlas-app', href: '/dashboard/projects', meta: 'main' },
  { id: 'r2', kind: 'repo', title: 'docs-site', fullName: 'org/docs-site', href: '/dashboard/projects', meta: 'docs' },
  { id: 'r3', kind: 'repo', title: 'api-gateway', fullName: 'org/api-gateway', href: '/dashboard/projects', meta: 'main' },
]
const MOCK_ISSUES: SearchResult[] = [
  { id: 'i1', kind: 'issue', title: 'Add global search', repoName: 'atlas-app', state: 'open', href: '/dashboard/projects', meta: '#42' },
  { id: 'i2', kind: 'issue', title: 'Fix login redirect', repoName: 'atlas-app', state: 'closed', href: '/dashboard/projects', meta: '#38' },
  { id: 'i3', kind: 'issue', title: 'Document API', repoName: 'docs-site', state: 'open', href: '/dashboard/projects', meta: '#12' },
]
const MOCK_NOTES: SearchResult[] = [
  { id: 'n1', kind: 'note', title: 'Sprint planning notes', contentPreview: 'Goals and tasks for Q1', href: '/dashboard/research', meta: 'Research' },
  { id: 'n2', kind: 'note', title: 'Meeting notes – product', contentPreview: 'Feature priorities', href: '/dashboard/research', meta: 'Research' },
]
const MOCK_EVENTS: SearchResult[] = [
  { id: 'e1', kind: 'event', title: 'Team standup', start: '09:00', end: '09:15', href: '/dashboard/calendar', meta: 'Today' },
  { id: 'e2', kind: 'event', title: 'Sprint review', start: '14:00', end: '15:00', href: '/dashboard/calendar', meta: 'This week' },
]
const MOCK_TRANSACTIONS: SearchResult[] = [
  { id: 't1', kind: 'transaction', title: 'AWS invoice', amount: '$120', date: '2025-02-01', href: '/dashboard/finance', meta: 'Paid' },
  { id: 't2', kind: 'transaction', title: 'Software license', amount: '$49', date: '2025-02-10', href: '/dashboard/finance', meta: 'Pending' },
]
const MOCK_AGENTS: SearchResult[] = [
  { id: 'a1', kind: 'agent', title: 'Personal assistant', description: 'Daily tasks and calendar', href: '/dashboard/agents', meta: 'Active' },
  { id: 'a2', kind: 'agent', title: 'Content writer', description: 'Drafts and ideas', href: '/dashboard/agents', meta: 'Active' },
]

const ALL_MOCK: SearchResult[] = [
  ...MOCK_REPOS,
  ...MOCK_ISSUES,
  ...MOCK_NOTES,
  ...MOCK_EVENTS,
  ...MOCK_TRANSACTIONS,
  ...MOCK_AGENTS,
]

function searchableText(r: SearchResult): string {
  const parts = [r.title, r.subtitle, r.meta].filter(Boolean) as string[]
  if ('fullName' in r && r.fullName) parts.push(r.fullName)
  if ('repoName' in r && r.repoName) parts.push(r.repoName)
  if ('contentPreview' in r && r.contentPreview) parts.push(r.contentPreview)
  if ('description' in r && r.description) parts.push(r.description)
  return parts.join(' ')
}

function filterByKind(results: SearchResult[], kinds: SearchResultKind[]): SearchResult[] {
  if (kinds.length === 0) return results
  const set = new Set(kinds)
  return results.filter((r) => set.has(r.kind))
}

/**
 * Search repos, issues, notes, events, transactions, and agents.
 * Uses backend /api/search when available; otherwise client-side fuzzy search over mock data.
 */
export async function searchGlobal(
  query: string,
  filters: GlobalSearchFilters
): Promise<GlobalSearchResponse> {
  const q = query.trim()
  const useBackend = typeof import.meta.env.VITE_API_URL === 'string' && import.meta.env.VITE_API_URL.length > 0

  if (useBackend) {
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      filters.kinds.forEach((k) => params.append('kind', k))
      const path = `/search?${params.toString()}`
      const data = await apiGet<GlobalSearchResponse>(path)
      return { results: data.results ?? [], total: data.total ?? 0 }
    } catch {
      // Fallback to client-side search on API error
    }
  }

  let results = ALL_MOCK
  if (filters.kinds.length > 0) {
    results = filterByKind(results, filters.kinds)
  }
  if (!q) {
    return { results, total: results.length }
  }
  const matched = results.filter((r) => fuzzyMatch(searchableText(r), q))
  const scored = matched
    .map((r) => ({ r, score: fuzzyScore(searchableText(r), q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ r }) => r)
  return { results: scored, total: scored.length }
}
