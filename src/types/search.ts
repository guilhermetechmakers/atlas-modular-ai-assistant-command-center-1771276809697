/**
 * Global search entity kinds across the workspace.
 */
export type SearchResultKind =
  | 'repo'
  | 'issue'
  | 'note'
  | 'event'
  | 'transaction'
  | 'agent'

export interface SearchResultBase {
  id: string
  kind: SearchResultKind
  title: string
  subtitle?: string
  /** Route to navigate on select */
  href: string
  /** Optional metadata for display (e.g. date, status) */
  meta?: string
}

export interface RepoSearchResult extends SearchResultBase {
  kind: 'repo'
  fullName?: string
}

export interface IssueSearchResult extends SearchResultBase {
  kind: 'issue'
  repoName?: string
  state?: string
}

export interface NoteSearchResult extends SearchResultBase {
  kind: 'note'
  contentPreview?: string
}

export interface EventSearchResult extends SearchResultBase {
  kind: 'event'
  start?: string
  end?: string
}

export interface TransactionSearchResult extends SearchResultBase {
  kind: 'transaction'
  amount?: string
  date?: string
}

export interface AgentSearchResult extends SearchResultBase {
  kind: 'agent'
  description?: string
}

export type SearchResult =
  | RepoSearchResult
  | IssueSearchResult
  | NoteSearchResult
  | EventSearchResult
  | TransactionSearchResult
  | AgentSearchResult

export interface GlobalSearchFilters {
  kinds: SearchResultKind[]
}

export interface GlobalSearchResponse {
  results: SearchResult[]
  total: number
}
