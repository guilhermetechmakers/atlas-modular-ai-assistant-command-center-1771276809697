import { Link } from 'react-router-dom'
import { FolderGit2, FileText, Calendar, Wallet, Bot, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardOverview() {
  const isLoading = false

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-display font-bold text-foreground">Today</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Your daily summary and quick actions.
        </p>
      </div>

      {/* Today panel placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-lg" />
          ) : (
            <p className="text-muted-foreground">No events for today. Ask the Personal agent: &quot;What should I do today?&quot;</p>
          )}
        </CardContent>
      </Card>

      {/* Bento-style cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-primary" />
              GitHub
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/projects">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <p className="text-body text-muted-foreground">Repos and issues at a glance. Run &quot;Summarize my repos&quot;.</p>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan" />
              Content
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/content">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <p className="text-body text-muted-foreground">Drafts and pipeline. Ideas → schedule → publish.</p>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple" />
              Calendar
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/calendar">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <p className="text-body text-muted-foreground">Events and tasks. Connect Google Calendar.</p>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title flex items-center gap-2">
              <Wallet className="h-5 w-5 text-amber" />
              Finance
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/finance">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <p className="text-body text-muted-foreground">Ledger and runway. Import CSV or use AI summary.</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title flex items-center gap-2">
              <Bot className="h-5 w-5 text-pink" />
              Agent activity
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/agents">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <p className="text-body text-muted-foreground">Pending approvals and recent agent outputs will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/dashboard/audit">View audit log</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard/agents">Agent Builder</Link>
        </Button>
      </div>
    </div>
  )
}
