/** Admin / Command Center types: workspace overview, users, skills, usage, audit */

export interface WorkspaceOverview {
  id: string
  name: string
  memberCount: number
  activeProjectCount: number
  pendingApprovalsCount: number
  trend: 'up' | 'down' | 'neutral'
  trendPercent?: number
}

export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: 'user' | 'manager' | 'admin'
  joinedAt: string
  lastActiveAt: string | null
}

export interface SkillApprovalItem {
  id: string
  name: string
  description: string
  provider: string
  requestedAt: string
  requestedBy: string
}

export interface UsageDataPoint {
  date: string
  requests: number
  agents: number
}

export interface UsageStats {
  totalRequests: number
  totalAgents: number
  requestsTrend: number
  agentsTrend: number
  series: UsageDataPoint[]
}

export interface AuditLogEntry {
  id: string
  action: string
  actor: string
  resource: string
  timestamp: string
  details?: string
}
