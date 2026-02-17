import { useQuery } from '@tanstack/react-query'
import { searchGlobal } from '@/api/search'
import type { GlobalSearchFilters } from '@/types/search'

export const globalSearchQueryKey = ['global-search'] as const

export interface UseGlobalSearchParams {
  query: string
  filters: GlobalSearchFilters
  enabled?: boolean
}

export function useGlobalSearch({ query, filters, enabled = true }: UseGlobalSearchParams) {
  return useQuery({
    queryKey: [...globalSearchQueryKey, query, filters.kinds],
    queryFn: () => searchGlobal(query, filters),
    enabled: enabled && (query.length >= 0),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  })
}
