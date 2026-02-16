import { Link } from 'react-router-dom'
import { Search, BookOpen, MessageCircle, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="font-semibold text-foreground">Atlas</Link>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-body text-muted-foreground hover:text-foreground">Log in</Link>
            <Link to="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-display font-bold text-foreground">Docs & Help</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Searchable docs, FAQ, contact, changelog.
        </p>

        <div className="relative mt-6 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search docs…" className="pl-9" />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground">
                Setup, self-host guide, and feature docs.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                FAQ & Changelog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground">
                Common questions and release notes.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground mb-4">Report an issue or request help.</p>
            <Button>Contact support</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
