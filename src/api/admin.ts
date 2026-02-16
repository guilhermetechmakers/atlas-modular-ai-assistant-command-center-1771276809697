import { apiGet, apiPost } from '@/lib/api'
import type {
  WorkspaceOverview,
  AdminUser,
  SkillApprovalItem,
  UsageStats,
  AuditLogEntry,
} from '@/types/admin'

const ADMIN_BASE = '/admin'

async function getOrEmpty<T>(path: string, empty: T): Promise<T> {
  try {
    const res = await apiGet<T>(path)
    return res ?? empty
  } catch {
    return empty
  }
}

/** Workspace overview for admin dashboard */
export async function getWorkspaceOverview(): Promise<WorkspaceOverview | null> {
  try {
    const res = await apiGet<WorkspaceOverview>(`${ADMIN_BASE}/workspace/overview`)
    return res
  } catch {
    return null
  }
}

/** Paginated user list for admin */
export async function getAdminUsers(params?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ users: AdminUser[]; total: number }> {
  try {
    const q = new URLSearchParams()
    if (params?.search) q.set('search', params.search)
    if (params?.page != null) q.set('page', String(params.page))
    if (params?.limit != null) q.set('limit', String(params.limit))
    const query = q.toString()
    const res = await apiGet<{ users: AdminUser[]; total: number }>(
      `${ADMIN_BASE}/users${query ? `?${query}` : ''}`
    )
    return res
  } catch {
    return { users: [], total: 0 }
  }
}

/** Skill approval queue */
export async function getSkillApprovalQueue(): Promise<SkillApprovalItem[]> {
  return getOrEmpty<SkillApprovalItem[]>(`${ADMIN_BASE}/skills/pending`, [])
}

/** Approve a skill */
export async function approveSkill(id: string): Promise<void> {
  await apiPost(`${ADMIN_BASE}/skills/${id}/approve`, {})
}

/** Reject a skill */
export async function rejectSkill(id: string): Promise<void> {
  await apiPost(`${ADMIN_BASE}/skills/${id}/reject`, {})
}

/** Usage analytics for dashboard */
export async function getUsageAnalytics(params?: {
  from?: string
  to?: string
}): Promise<UsageStats> {
  try {
    const q = new URLSearchParams()
    if (params?.from) q.set('from', params.from)
    if (params?.to) q.set('to', params.to)
    const query = q.toString()
    const res = await apiGet<UsageStats>(
      `${ADMIN_BASE}/usage${query ? `?${query}` : ''}`
    )
    return res
  } catch {
    return {
      totalRequests: 0,
      totalAgents: 0,
      requestsTrend: 0,
      agentsTrend: 0,
      series: [],
    }
  }
}

/** Recent audit log entries */
export async function getAuditLog(params?: {
  limit?: number
  offset?: number
}): Promise<AuditLogEntry[]> {
  try {
    const q = new URLSearchParams()
    if (params?.limit != null) q.set('limit', String(params.limit))
    if (params?.offset != null) q.set('offset', String(params.offset))
    const query = q.toString()
    const res = await apiGet<AuditLogEntry[]>(
      `${ADMIN_BASE}/audit${query ? `?${query}` : ''}`
    )
    return Array.isArray(res) ? res : []
  } catch {
    return []
  }
}
