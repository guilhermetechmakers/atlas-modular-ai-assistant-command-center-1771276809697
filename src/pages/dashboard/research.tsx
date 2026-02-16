import { BookOpen, Plus, StickyNote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export function ResearchPage() {
  const isLoading = false

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display font-bold text-foreground">Research & Knowledge Base</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Notes, clips, summaries, and decisions with citations.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New note
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            Notes
          </CardTitle>
          <CardContent className="pt-0">
            <Input placeholder="Search notes…" className="max-w-md mb-4" />
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">No notes yet. Add a note or use the web clipper.</p>
                <Button variant="outline" className="mt-4">New note</Button>
              </div>
            )}
          </CardContent>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summarize & compare</CardTitle>
          <CardContent className="pt-0">
            <p className="text-body text-muted-foreground">
              Use the summarize button on notes and compare view for side-by-side research.
            </p>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
