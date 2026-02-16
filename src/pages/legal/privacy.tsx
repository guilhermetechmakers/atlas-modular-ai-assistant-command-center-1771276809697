import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="font-semibold text-foreground">Atlas</Link>
          <Link to="/">
            <Button variant="ghost" size="sm">Home</Button>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
        <h1>Privacy Policy</h1>
        <p className="lead">
          This page describes how Atlas collects, uses, and protects your data. For self-hosted instances, data stays on your infrastructure.
        </p>
        <h2>Data we collect</h2>
        <p>Account and workspace data, usage necessary for the service, and optional integrations you connect.</p>
        <h2>How we use it</h2>
        <p>To provide the service, improve product quality, and comply with legal obligations.</p>
        <h2>Your rights</h2>
        <p>Access, correction, export, and deletion where applicable. Use Settings for export and account options.</p>
        <p className="mt-8">
          <Link to="/" className="text-primary hover:underline">Back to home</Link>
        </p>
      </main>
    </div>
  )
}
