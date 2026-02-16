import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function TermsPage() {
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
        <h1>Terms of Service</h1>
        <p className="lead">
          By using Atlas you agree to these terms. Self-hosted deployments are governed by the license you use to run the software.
        </p>
        <h2>Use of the service</h2>
        <p>You must use the service in compliance with applicable laws and not abuse or harm the system or other users.</p>
        <h2>Acceptable use</h2>
        <p>No illegal content, abuse of APIs, or circumvention of security or audit controls.</p>
        <h2>Changes</h2>
        <p>We may update these terms; continued use after changes constitutes acceptance.</p>
        <p className="mt-8">
          <Link to="/" className="text-primary hover:underline">Back to home</Link>
        </p>
      </main>
    </div>
  )
}
