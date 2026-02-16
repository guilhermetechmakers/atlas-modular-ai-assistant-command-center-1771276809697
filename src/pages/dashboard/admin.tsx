import { Users, BarChart3, Shield, FileText, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function AdminPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-body text-muted-foreground">
          User management, usage analytics, skill approval queue, audit logs, system settings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">Invites, roles, permissions.</p>
            <Button variant="outline" className="mt-4">Manage users</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Usage analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">Usage and rate limits.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Skill approval queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">Approve or reject third-party skills.</p>
            <Button variant="outline" className="mt-4">View queue</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit logs
          </CardTitle>
          <CardContent className="pt-0">
            <p className="text-body text-muted-foreground">Append-only audit log viewer with retention.</p>
            <Button variant="outline">View logs</Button>
          </CardContent>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System settings
          </CardTitle>
          <CardContent className="pt-0">
            <p className="text-body text-muted-foreground">Retention, backup policy, RBAC config.</p>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
