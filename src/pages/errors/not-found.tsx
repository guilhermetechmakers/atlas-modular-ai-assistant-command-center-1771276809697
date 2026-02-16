import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center animate-fade-in-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-display font-bold text-foreground">Page not found</h1>
        <p className="mt-2 text-body text-muted-foreground">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/help">Help</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
