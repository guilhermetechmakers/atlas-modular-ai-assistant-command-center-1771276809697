import { Bot, Plus, Wrench, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export function AgentsPage() {
  const isLoading = false

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display font-bold text-foreground">Agent Builder & Skills Registry</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Create custom agents and manage permissioned skills.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New agent
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-body text-muted-foreground mb-4">
                Create agent name, instructions, tone; select skills and approval policy.
              </p>
              {isLoading ? <Skeleton className="h-24 w-full" /> : (
                <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
                  No custom agents. Create one to get started.
                </div>
              )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-cyan" />
              Skill Registry
            </CardTitle>
          </CardHeader>
          <CardContent>
              <Input placeholder="Search skills…" className="mb-4" />
              <p className="text-body text-muted-foreground">Allowlisted skills per agent; admin approval for third-party.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple" />
            Approval policy & test console
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-body text-muted-foreground">
              Set approval policy per agent. Use the test console to run simulated prompts and review logs.
            </p>
            <Button variant="outline" className="mt-4">Open test console</Button>
        </CardContent>
      </Card>
    </div>
  )
}
