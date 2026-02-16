import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  BarChart3,
  Shield,
  FileText,
  Settings,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Check,
  X,
  UserPlus,
  Activity,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  useAdminWorkspaceOverview,
  useAdminUsers,
  useSkillApprovalQueue,
  useApproveSkill,
  useRejectSkill,
  useUsageAnalytics,
  useAuditLog,
} from '@/hooks/use-admin'
import { cn } from '@/lib/utils'

const AUDIT_LIMIT = 5
const USERS_PAGE_SIZE = 5

function WorkspaceOverviewWidget() {
  const { data: overview, isLoading, isError } = useAdminWorkspaceOverview()

  if (isError) {
    return (
      <Card className="overflow-hidden border-destructive/30">
        <CardContent className="pt-6">
          <p className="text-body text-destructive">Failed to load workspace overview.</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading || !overview) {
    return (
      <Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const TrendIcon = overview.trend === 'up' ? TrendingUp : overview.trend === 'down' ? TrendingDown : Minus
  const trendColor =
    overview.trend === 'up'
      ? 'text-emerald-500'
      : overview.trend === 'down'
        ? 'text-destructive'
        : 'text-muted-foreground'

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-title flex items-center gap-2 text-foreground">
          <Activity className="h-5 w-5 text-primary" />
          Workspace overview
        </CardTitle>
        <CardDescription>{overview.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border/50 bg-card/50 px-4 py-3">
            <p className="text-caption text-muted-foreground">Members</p>
            <p className="text-title font-semibold text-foreground">{overview.memberCount}</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/50 px-4 py-3">
            <p className="text-caption text-muted-foreground">Active projects</p>
            <p className="text-title font-semibold text-foreground">{overview.activeProjectCount}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <TrendIcon className={cn('h-4 w-4', trendColor)} aria-hidden />
          <span className={cn('text-caption', trendColor)}>
            {overview.trendPercent != null
              ? `${overview.trend === 'down' ? '-' : ''}${overview.trendPercent}% vs last period`
              : overview.trend === 'neutral'
                ? 'No change'
                : 'Trend'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function UserListWidget() {
  const [search, setSearch] = useState('')
  const { data, isLoading, isError } = useAdminUsers({
    search: search || undefined,
    page: 0,
    limit: USERS_PAGE_SIZE,
  })

  const users = data?.users ?? []
  const total = data?.total ?? 0

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-destructive">Failed to load users.</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Users
            </CardTitle>
            <CardDescription>Workspace members and roles</CardDescription>
          </div>
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50"
              aria-label="Search users"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground/50" aria-hidden />
              <p className="mt-2 text-body font-medium text-foreground">No users found</p>
              <p className="mt-1 text-caption text-muted-foreground">
                {search ? 'Try a different search.' : 'Workspace members will appear here.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-body">
              <thead className="sticky top-0 z-10 border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-foreground">Name</th>
                  <th className="px-4 py-3 font-medium text-foreground hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 font-medium text-foreground">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{u.name ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                        {u.role}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {total > USERS_PAGE_SIZE && (
          <div className="border-t border-border px-4 py-2 flex justify-end">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/admin?tab=users">View all ({total})</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SkillApprovalQueueWidget() {
  const { data, isLoading, isError } = useSkillApprovalQueue()
  const items = data ?? []
  const approveMutation = useApproveSkill()
  const rejectMutation = useRejectSkill()

  const handleApprove = (id: string, name: string) => {
    approveMutation.mutate(id, {
      onSuccess: () => toast.success(`"${name}" approved`),
      onError: (err) => toast.error(err instanceof Error ? err.message : 'Approve failed'),
    })
  }

  const handleReject = (id: string, name: string) => {
    rejectMutation.mutate(id, {
      onSuccess: () => toast.success(`"${name}" rejected`),
      onError: (err) => toast.error(err instanceof Error ? err.message : 'Reject failed'),
    })
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Skill approval queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-destructive">Failed to load queue.</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Skill approval queue
        </CardTitle>
        <CardDescription>Approve or reject third-party skills</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
            <Shield className="h-10 w-10 text-muted-foreground/50" aria-hidden />
            <p className="mt-2 text-body font-medium text-foreground">Queue is empty</p>
            <p className="mt-1 text-caption text-muted-foreground">
              Pending skill requests will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.slice(0, 5).map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-border bg-muted/20 px-4 py-3 transition-colors hover:border-primary/30"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-caption text-muted-foreground truncate">{item.provider}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-600 border-emerald-500/50 hover:bg-emerald-500/10"
                      onClick={() => handleApprove(item.id, item.name)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      aria-label={`Approve ${item.name}`}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/50 hover:bg-destructive/10"
                      onClick={() => handleReject(item.id, item.name)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      aria-label={`Reject ${item.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function UsageAnalyticsWidget() {
  const { data: stats, isLoading, isError } = useUsageAnalytics()

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Usage analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-destructive">Failed to load usage.</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const series = stats?.series ?? []
  const hasChartData = series.length > 0

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Usage analytics
        </CardTitle>
        <CardDescription>Requests and agent usage</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-lg border border-border/50 bg-gradient-to-br from-primary/10 to-transparent px-4 py-3">
                <p className="text-caption text-muted-foreground">Total requests</p>
                <p className="text-title font-semibold text-foreground">{stats?.totalRequests ?? 0}</p>
                {stats?.requestsTrend != null && stats.requestsTrend !== 0 && (
                  <p
                    className={cn(
                      'text-caption mt-0.5',
                      stats.requestsTrend > 0 ? 'text-emerald-500' : 'text-destructive'
                    )}
                  >
                    {stats.requestsTrend > 0 ? '+' : ''}{stats.requestsTrend}% vs last period
                  </p>
                )}
              </div>
              <div className="rounded-lg border border-border/50 bg-gradient-to-br from-cyan/10 to-transparent px-4 py-3">
                <p className="text-caption text-muted-foreground">Agent runs</p>
                <p className="text-title font-semibold text-foreground">{stats?.totalAgents ?? 0}</p>
                {stats?.agentsTrend != null && stats.agentsTrend !== 0 && (
                  <p
                    className={cn(
                      'text-caption mt-0.5',
                      stats.agentsTrend > 0 ? 'text-emerald-500' : 'text-destructive'
                    )}
                  >
                    {stats.agentsTrend > 0 ? '+' : ''}{stats.agentsTrend}% vs last period
                  </p>
                )}
              </div>
            </div>
            {hasChartData ? (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(255, 153, 0)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="rgb(255, 153, 0)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(39,39,42,0.5)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: 'rgb(161, 161, 170)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'rgb(161, 161, 170)' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(35, 35, 38)',
                        border: '1px solid rgb(39, 39, 42)',
                        borderRadius: '0.5rem',
                        color: 'rgb(229, 231, 235)',
                      }}
                      labelStyle={{ color: 'rgb(229, 231, 235)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="rgb(255, 153, 0)"
                      fill="url(#usageGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 h-32 text-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground/50" aria-hidden />
                <p className="mt-2 text-caption text-muted-foreground">No usage data yet</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function AuditLogWidget() {
  const { data: entries, isLoading, isError } = useAuditLog({ limit: AUDIT_LIMIT })

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-destructive">Failed to load audit log.</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const list = entries ?? []

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="pb-3">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Audit log
            </CardTitle>
            <CardDescription>Recent agent actions and approvals</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/audit" className="flex items-center gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" aria-hidden />
            <p className="mt-2 text-body font-medium text-foreground">No audit entries yet</p>
            <p className="mt-1 text-caption text-muted-foreground">
              Agent actions and approvals will appear here.
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to="/dashboard/audit">View audit log</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {list.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-0.5 rounded-lg border border-border/50 px-3 py-2 text-body transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0">
                  <span className="font-medium text-foreground">{entry.action}</span>
                  <span className="text-caption text-muted-foreground">{entry.actor}</span>
                </div>
                <span className="text-caption text-muted-foreground truncate">{entry.resource}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function AdminPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-display font-bold text-foreground">Administration Dashboard</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Workspace overview, user list, skill approval queue, usage analytics, and audit log.
        </p>
      </div>

      <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <WorkspaceOverviewWidget />
      </section>

      <section
        className="grid gap-6 lg:grid-cols-2 animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
      >
        <UserListWidget />
        <SkillApprovalQueueWidget />
      </section>

      <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <UsageAnalyticsWidget />
      </section>

      <section
        className="grid gap-6 lg:grid-cols-2 animate-fade-in-up"
        style={{ animationDelay: '400ms' }}
      >
        <AuditLogWidget />
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              System settings
            </CardTitle>
            <CardDescription>
              Retention, backup policy, RBAC config.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground mb-4">
              Configure data retention, backup schedules, and role-based access.
            </p>
            <Button variant="outline" className="transition-transform hover:scale-[1.02]">
              Open system settings
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
