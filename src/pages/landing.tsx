import { Link } from 'react-router-dom'
import { ArrowRight, Github, Calendar, Bot, Shield, Zap, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-cyan/10 animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 h-full w-full bg-gradient-to-tl from-purple/10 via-transparent to-primary/5" />
        <div className="absolute inset-0 bg-[#18181B]" />
      </div>

      <header className="border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-bold text-foreground">Atlas</span>
          <nav className="flex items-center gap-4">
            <Link
              to="/help"
              className="text-body text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-hero md:text-5xl font-bold tracking-tight text-foreground animate-fade-in-up">
              Your unified command center
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up leading-relaxed">
              Projects, content, research, calendar, and finance in one searchable workspace—powered by domain-specific AI agents you control.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up">
              <Link to="/signup">
                <Button size="lg" className="min-w-[180px]">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/help">
                <Button variant="outline" size="lg">
                  Self-host Guide
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature grid - Bento-style */}
        <section className="border-t border-border/50 px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-display font-bold text-foreground mb-12 text-center">
              One workspace. Every domain.
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Github, title: 'GitHub-first PM', desc: 'Repos, issues, roadmaps, and AI PM actions in one place.' },
                { icon: FileText, title: 'Content Pipeline', desc: 'Ideas → drafts → schedule → publish with repurpose & calendar.' },
                { icon: Calendar, title: 'Calendar & Travel', desc: 'Events, tasks, trip planning, and personal AI actions.' },
                { icon: Bot, title: 'Modular AI Agents', desc: 'Per-domain agents with memory, skills, and human-in-the-loop.' },
                { icon: Shield, title: 'Audit & control', desc: 'Append-only logs, approvals, RBAC, and self-host friendly.' },
                { icon: Zap, title: 'Global search', desc: 'Search across repos, notes, events, and transactions.' },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  className={cn(
                    'rounded-card-lg border border-border bg-card p-6 transition-all duration-200 hover:shadow-card-hover hover:border-primary/30',
                    i === 0 && 'md:col-span-2'
                  )}
                >
                  <Icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-title font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-body text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/50 px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-display font-bold text-foreground">
              Ready to replace the chaos?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Start with a single workspace. Connect GitHub and Calendar when you’re ready.
            </p>
            <Link to="/signup" className="mt-8 inline-block">
              <Button size="lg" className="min-w-[200px]">
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-caption text-muted-foreground">© Atlas. Self-hostable command center.</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-caption text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-caption text-muted-foreground hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
