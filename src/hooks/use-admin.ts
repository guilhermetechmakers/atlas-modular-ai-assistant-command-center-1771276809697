import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getWorkspaceOverview,
  getAdminUsers,
  getSkillApprovalQueue,
  approveSkill as apiApproveSkill,
  rejectSkill as apiRejectSkill,
  getUsageAnalytics,
  getAuditLog,
} from '@/api/admin'

export const adminQueryKeys = {
  workspaceOverview: ['admin', 'workspace-overview'] as const,
  users: (search?: string, page?: number) =>
    ['admin', 'users', search ?? '', page ?? 0] as const,
  skillQueue: ['admin', 'skill-queue'] as const,
  usage: (from?: string, to?: string) =>
    ['admin', 'usage', from ?? '', to ?? ''] as const,
  audit: (limit?: number, offset?: number) =>
    ['admin', 'audit', limit ?? 10, offset ?? 0] as const,
}

export function useAdminWorkspaceOverview() {
  return useQuery({
    queryKey: adminQueryKeys.workspaceOverview,
    queryFn: getWorkspaceOverview,
    staleTime: 60 * 1000,
  })
}

export function useAdminUsers(options?: {
  search?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: adminQueryKeys.users(options?.search, options?.page),
    queryFn: () =>
      getAdminUsers({
        search: options?.search,
        page: options?.page,
        limit: options?.limit ?? 10,
      }),
    staleTime: 30 * 1000,
  })
}

export function useSkillApprovalQueue() {
  return useQuery({
    queryKey: adminQueryKeys.skillQueue,
    queryFn: getSkillApprovalQueue,
    staleTime: 30 * 1000,
  })
}

export function useApproveSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiApproveSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.skillQueue })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.workspaceOverview })
    },
  })
}

export function useRejectSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiRejectSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.skillQueue })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.workspaceOverview })
    },
  })
}

export function useUsageAnalytics(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: adminQueryKeys.usage(params?.from, params?.to),
    queryFn: () => getUsageAnalytics(params),
    staleTime: 60 * 1000,
  })
}

export function useAuditLog(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: adminQueryKeys.audit(params?.limit, params?.offset),
    queryFn: () => getAuditLog({ limit: params?.limit ?? 10, offset: params?.offset }),
    staleTime: 30 * 1000,
  })
}
