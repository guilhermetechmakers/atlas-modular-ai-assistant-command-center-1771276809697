import { Link } from 'react-router-dom'
import { User, Plug, Shield, CreditCard, Download, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-display font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Profile, integrations, security, billing, and self-host.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">Avatar, display name, email.</p>
            <Button variant="outline" className="mt-4 transition-transform hover:scale-[1.02]" asChild>
              <Link to="/dashboard/profile">Edit profile</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-5 w-5" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">GitHub, Google Calendar, and other connectors.</p>
            <Button variant="outline" className="mt-4 transition-transform hover:scale-[1.02]" asChild>
              <Link to="/dashboard/profile">Manage</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">2FA, sessions, re-auth for sensitive ops.</p>
            <Button variant="outline" className="mt-4">2FA setup</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing & plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">Plan and usage.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & backup
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Button variant="outline" className="transition-transform hover:scale-[1.02]" asChild>
            <Link to="/dashboard/profile">Export workspace</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Self-host docs
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-body text-muted-foreground">Docker deployment and backups.</p>
          <Button variant="outline" asChild>
            <a href="/help">View guide</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
