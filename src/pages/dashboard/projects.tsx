import { useState } from 'react'
import { FolderGit2, Plus, List, LayoutGrid } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export function ProjectsPage() {
  const [view, setView] = useState<'list' | 'board'>('list')
  const isLoading = false

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Repo explorer and project management mapped to GitHub.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('list')}
            aria-label="List view"
            aria-pressed={view === 'list'}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('board')}
            aria-label="Board view"
            aria-pressed={view === 'board'}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New issue
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-primary" />
            Repo selector
          </CardTitle>
          <CardContent className="pt-0">
            <Input placeholder="Search or select repository…" className="max-w-md" />
          </CardContent>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity & issues</CardTitle>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
                <FolderGit2 className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">Connect a GitHub repo to see activity and issues.</p>
                <Button variant="outline" className="mt-4">Connect GitHub</Button>
              </div>
            )}
          </CardContent>
        </CardHeader>
      </Card>

      <div className="flex gap-2">
        <Badge variant="secondary">Roadmap</Badge>
        <Badge variant="outline">Milestones</Badge>
        <Badge variant="outline">Kanban</Badge>
      </div>
    </div>
  )
}
