import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export function AuditPage() {
  const isLoading = false

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Audit log' },
        ]}
        className="mb-2"
      />
      <div>
        <h1 className="text-display font-bold text-foreground">Audit log</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Immutable log of agent actions and approvals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Log entries
          </CardTitle>
          <CardContent className="pt-0">
            <Input placeholder="Filter by action, agent, date…" className="max-w-md mb-4" />
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
                No audit entries yet. Agent actions will appear here.
              </div>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
