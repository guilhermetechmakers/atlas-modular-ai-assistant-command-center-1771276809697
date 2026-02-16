import { Link } from 'react-router-dom'
import { FileText, Plus, Lightbulb, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function ContentPipelinePage() {
  const isLoading = false

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display font-bold text-foreground">Content Pipeline</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Ideas → drafts → schedule → publish.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/content/new">
            <Plus className="mr-2 h-4 w-4" />
            Add content
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber" />
              Ideas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-20 w-full" /> : (
              <p className="text-body text-muted-foreground">Quick capture and idea list.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan" />
              Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-20 w-full" /> : (
              <p className="text-body text-muted-foreground">Editor, version history, assets.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-20 w-full" /> : (
              <p className="text-body text-muted-foreground">Schedule and repurpose tool.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content list</CardTitle>
          <CardContent className="pt-0">
            <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">No content yet. Add an idea or draft to get started.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/dashboard/content/new">Add content</Link>
              </Button>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
