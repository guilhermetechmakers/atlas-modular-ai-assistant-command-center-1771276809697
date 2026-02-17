import * as React from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  FolderGit2,
  GitBranch,
  FileText,
  Calendar,
  Wallet,
  Bot,
  X,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useGlobalSearch } from '@/hooks/use-global-search'
import type { SearchResult, SearchResultKind } from '@/types/search'

const KINDS: { value: SearchResultKind; label: string }[] = [
  { value: 'repo', label: 'Repos' },
  { value: 'issue', label: 'Issues' },
  { value: 'note', label: 'Notes' },
  { value: 'event', label: 'Events' },
  { value: 'transaction', label: 'Transactions' },
  { value: 'agent', label: 'Agents' },
]

const KIND_ICONS: Record<SearchResultKind, React.ElementType> = {
  repo: FolderGit2,
  issue: GitBranch,
  note: FileText,
  event: Calendar,
  transaction: Wallet,
  agent: Bot,
}

const KIND_LABELS: Record<SearchResultKind, string> = {
  repo: 'Repos',
  issue: 'Issues',
  note: 'Notes',
  event: 'Events',
  transaction: 'Transactions',
  agent: 'Agents',
}

function groupByKind(results: SearchResult[]): Map<SearchResultKind, SearchResult[]> {
  const map = new Map<SearchResultKind, SearchResult[]>()
  for (const r of results) {
    const list = map.get(r.kind) ?? []
    list.push(r)
    map.set(r.kind, list)
  }
  return map
}

const DEBOUNCE_MS = 200

export interface GlobalSearchProps {
  /** Controlled open state when used from layout */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Optional trigger element ref to restore focus on close */
  triggerRef?: React.RefObject<HTMLInputElement | null>
  className?: string
}

export function GlobalSearch({
  open: controlledOpen,
  onOpenChange,
  triggerRef,
  className,
}: GlobalSearchProps) {
  const navigate = useNavigate()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = React.useCallback(
    (value: boolean) => {
      onOpenChange?.(value)
      if (controlledOpen === undefined) setInternalOpen(value)
    },
    [controlledOpen, onOpenChange]
  )

  const [query, setQuery] = React.useState('')
  const [debouncedQuery, setDebouncedQuery] = React.useState('')
  const [kinds, setKinds] = React.useState<SearchResultKind[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const overlayInputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const internalTriggerRef = React.useRef<HTMLInputElement>(null)
  const triggerInputRef = triggerRef ?? internalTriggerRef

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [query])

  const filters = React.useMemo(() => ({ kinds }), [kinds])
  const { data, isLoading, isError, refetch } = useGlobalSearch({
    query: debouncedQuery,
    filters,
    enabled: open,
  })

  const results = data?.results ?? []
  const flatResults = React.useMemo(() => results, [results])
  const grouped = React.useMemo(() => groupByKind(results), [results])

  React.useEffect(() => {
    if (!open) return
    overlayInputRef.current?.focus()
    setSelectedIndex(0)
  }, [open])

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [debouncedQuery, kinds])

  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        triggerInputRef.current?.focus()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i < flatResults.length - 1 ? i + 1 : i))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i > 0 ? i - 1 : 0))
        return
      }
      if (e.key === 'Enter' && flatResults[selectedIndex]) {
        e.preventDefault()
        navigate(flatResults[selectedIndex].href)
        setOpen(false)
        setQuery('')
        triggerInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, flatResults, selectedIndex, navigate, setOpen, triggerInputRef])

  React.useEffect(() => {
    const el = listRef.current
    if (!el) return
    const item = el.querySelector(`[data-index="${selectedIndex}"]`)
    item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedIndex])

  const toggleKind = (kind: SearchResultKind) => {
    setKinds((prev) =>
      prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]
    )
  }

  const handleSelect = (r: SearchResult) => {
    navigate(r.href)
    setOpen(false)
    setQuery('')
    triggerInputRef.current?.focus()
  }

  const handleTriggerFocus = () => setOpen(true)
  const handleTriggerClick = () => setOpen(true)

  return (
    <>
      <div className={cn('relative flex-1 max-w-2xl', className)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          ref={triggerInputRef as React.Ref<HTMLInputElement>}
          type="search"
          placeholder="Search repos, issues, notes, events, transactions, agents…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleTriggerFocus}
          onClick={handleTriggerClick}
          className="pl-9 bg-muted/50"
          aria-label="Global search"
          aria-expanded={open}
          aria-haspopup="dialog"
        />
      </div>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Global search results"
            className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 pb-4"
          >
            <div
              className="absolute inset-0 bg-black/60 transition-opacity duration-200 animate-fade-in"
              onClick={() => {
                setOpen(false)
                triggerInputRef.current?.focus()
              }}
              aria-hidden
            />
            <div
              className={cn(
                'relative z-50 w-full max-w-2xl rounded-card-lg border border-border bg-card shadow-card',
                'animate-fade-in-up overflow-hidden flex flex-col max-h-[70vh]'
              )}
            >
              <div className="flex items-center gap-2 border-b border-border p-2">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  ref={overlayInputRef}
                  type="search"
                  placeholder="Search repos, issues, notes, events…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 flex-1"
                  aria-label="Search query"
                  autoComplete="off"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => {
                    setOpen(false)
                    triggerInputRef.current?.focus()
                  }}
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 p-2 border-b border-border bg-muted/30">
                <Badge
                  variant={kinds.length === 0 ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:scale-[1.02]',
                    kinds.length === 0 && 'ring-2 ring-primary/50'
                  )}
                  onClick={() => setKinds([])}
                >
                  All
                </Badge>
                {KINDS.map(({ value, label }) => (
                  <Badge
                    key={value}
                    variant={kinds.includes(value) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:scale-[1.02]',
                      kinds.includes(value) && 'ring-2 ring-primary/50'
                    )}
                    onClick={() => toggleKind(value)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>

              <div
                ref={listRef}
                className="overflow-y-auto flex-1 min-h-0 p-2"
                role="listbox"
                aria-label="Search results"
              >
                {isLoading && (
                  <div className="space-y-2 p-4 animate-fade-in">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                  </div>
                )}

                {isError && (
                  <div className="flex flex-col items-center justify-center gap-4 p-8 text-center animate-fade-in">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <p className="text-body text-muted-foreground">
                      Something went wrong loading search results.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => refetch()}
                      className="min-h-[44px]"
                    >
                      Try again
                    </Button>
                  </div>
                )}

                {!isLoading && !isError && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-4 p-8 text-center animate-fade-in">
                    <Search className="h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="text-body font-medium text-foreground">
                      {debouncedQuery ? 'No results found' : 'Search across your workspace'}
                    </p>
                    <p className="text-caption text-muted-foreground max-w-sm">
                      {debouncedQuery
                        ? 'Try a different query or change filters.'
                        : 'Type to search repos, issues, notes, events, transactions, and agents.'}
                    </p>
                  </div>
                )}

                {!isLoading && !isError && results.length > 0 && (
                  <div className="space-y-4 animate-fade-in">
                    {Array.from(grouped.entries()).map(([kind, items]) => {
                      const Icon = KIND_ICONS[kind]
                      return (
                        <div key={kind}>
                          <p className="text-caption font-medium text-muted-foreground uppercase tracking-wider px-2 py-1">
                            {KIND_LABELS[kind]}
                          </p>
                          <ul className="space-y-1" role="none">
                            {items.map((r) => {
                              const idx = flatResults.indexOf(r)
                              const isSelected = idx === selectedIndex
                              return (
                                <li key={r.id} role="option" aria-selected={isSelected}>
                                  <button
                                    type="button"
                                    data-index={idx}
                                    onClick={() => handleSelect(r)}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    className={cn(
                                      'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200',
                                      'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                                      'min-h-[44px]',
                                      isSelected && 'bg-muted ring-2 ring-primary/30'
                                    )}
                                  >
                                    <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-body font-medium text-foreground truncate">
                                        {r.title}
                                      </p>
                                      {(r.subtitle ?? r.meta) && (
                                        <p className="text-caption text-muted-foreground truncate">
                                          {r.subtitle ?? r.meta}
                                        </p>
                                      )}
                                    </div>
                                    {r.meta && !r.subtitle && (
                                      <span className="text-caption text-muted-foreground shrink-0">
                                        {r.meta}
                                      </span>
                                    )}
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
