import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Github,
  Calendar,
  Bot,
  Shield,
  Zap,
  FileText,
  UserCog,
  LogIn,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: Github,
    title: 'GitHub-first PM',
    desc: 'Repos, issues, roadmaps, and AI PM actions in one place.',
    span: 2,
  },
  {
    icon: FileText,
    title: 'Content Pipeline',
    desc: 'Ideas → drafts → schedule → publish with repurpose & calendar.',
    span: 1,
  },
  {
    icon: Calendar,
    title: 'Calendar & Travel',
    desc: 'Events, tasks, trip planning, and personal AI actions.',
    span: 1,
  },
  {
    icon: Bot,
    title: 'Modular AI Agents',
    desc: 'Per-domain agents with memory, skills, and human-in-the-loop.',
    span: 1,
  },
  {
    icon: Shield,
    title: 'Audit & control',
    desc: 'Append-only logs, approvals, RBAC, and self-host friendly.',
    span: 1,
  },
  {
    icon: Zap,
    title: 'Global search',
    desc: 'Search across repos, notes, events, and transactions.',
    span: 2,
  },
] as const

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[rgb(var(--background))]" />
        <div
          className={cn(
            'absolute -top-1/2 -left-1/2 h-[140%] w-[140%] rounded-full',
            'bg-gradient-to-br from-primary/15 via-primary/5 to-transparent',
            'animate-gradient-mesh'
          )}
        />
        <div
          className={cn(
            'absolute -bottom-1/2 -right-1/2 h-[120%] w-[120%] rounded-full',
            'bg-gradient-to-tl from-purple/15 via-cyan/5 to-transparent',
            'animate-gradient-mesh [animation-delay:2s]'
          )}
        />
        <div
          className={cn(
            'absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl',
            'animate-float'
          )}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Atlas
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main navigation">
            <Link
              to="/help"
              className="text-body text-muted-foreground hover:text-foreground transition-colors duration-200 rounded px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Docs
            </Link>
            <Link to="/login/manager">
              <Button variant="ghost" size="sm" className="gap-1.5 min-h-[44px] sm:min-h-[40px]">
                <UserCog className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Manager</span>
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="gap-1.5 min-h-[44px] sm:min-h-[40px]">
                <LogIn className="h-4 w-4" aria-hidden />
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gap-1.5 min-w-[100px] min-h-[44px] sm:min-h-[40px] bg-gradient-to-r from-primary to-primary-orange hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-glow">
                <UserPlus className="h-4 w-4 sm:hidden" aria-hidden />
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative px-4 py-16 sm:py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className={cn(
                'text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl',
                'bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent',
                'animate-fade-in-up [animation-fill-mode:both]'
              )}
              style={{ lineHeight: 1.15 }}
            >
              Your unified command center
            </h1>
            <p
              className={cn(
                'mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed',
                'animate-fade-in-up [animation-fill-mode:both] [animation-delay:100ms]'
              )}
            >
              Projects, content, research, calendar, and finance in one searchable workspace—powered by domain-specific AI agents you control.
            </p>
            <div
              className={cn(
                'mt-10 flex flex-wrap items-center justify-center gap-4',
                'animate-fade-in-up [animation-fill-mode:both] [animation-delay:200ms]'
              )}
            >
              <Link to="/signup">
                <Button
                  size="lg"
                  className="min-w-[180px] min-h-[48px] bg-gradient-to-r from-primary to-primary-orange hover:opacity-90 hover:scale-[1.03] hover:shadow-glow transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] border-border hover:border-primary/50 hover:scale-[1.02] transition-all duration-200"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/login/manager">
                <Button
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] gap-2 border-border hover:border-primary/50 hover:scale-[1.02] transition-all duration-200"
                >
                  <UserCog className="h-4 w-4" aria-hidden />
                  Manager login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature grid - Bento-style */}
        <section className="border-t border-border/50 px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2
              className={cn(
                'text-display font-bold text-foreground mb-12 text-center',
                'animate-fade-in-up [animation-fill-mode:both]'
              )}
            >
              One workspace. Every domain.
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, desc, span }, i) => (
                <div
                  key={title}
                  className={cn(
                    'rounded-card-lg border border-border bg-card p-6 transition-all duration-200',
                    'hover:shadow-card-hover hover:border-primary/30 hover:scale-[1.01]',
                    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
                    span === 2 && 'md:col-span-2',
                    'animate-fade-in-up [animation-fill-mode:both]'
                  )}
                  style={{ animationDelay: `${150 + i * 80}ms` }}
                >
                  <Icon className="h-8 w-8 text-primary mb-3" aria-hidden />
                  <h3 className="text-title font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-body text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/50 px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-display font-bold text-foreground">
              Ready to replace the chaos?
            </h2>
            <p className="mt-4 text-body text-muted-foreground leading-relaxed">
              Start with a single workspace. Connect GitHub and Calendar when you're ready.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/signup" className="inline-block">
                <Button
                  size="lg"
                  className="min-w-[200px] min-h-[48px] bg-gradient-to-r from-primary to-primary-orange hover:opacity-90 hover:scale-[1.03] hover:shadow-glow transition-all duration-200"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/login" className="inline-block">
                <Button
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] hover:scale-[1.02] transition-all duration-200"
                >
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-caption text-muted-foreground text-center sm:text-left">
            © Atlas. Self-hostable command center.
          </span>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-caption text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-caption text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
