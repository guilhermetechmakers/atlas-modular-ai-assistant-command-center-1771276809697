import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ServerErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center animate-fade-in-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-6 text-display font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-body text-muted-foreground">
          We’re sorry. Please try again or contact support if the problem continues.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Retry</Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/help">Report issue</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
