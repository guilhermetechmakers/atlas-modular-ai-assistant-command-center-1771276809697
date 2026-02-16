import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Github, Mail, Building2, ChevronRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthCard } from '@/components/auth/auth-card'
import { useAuth } from '@/contexts/auth-context'
import { getOAuthLoginUrl, getAuthErrorMessage, login as authLogin } from '@/api/auth'
import { loginSchema, type LoginFormData } from '@/lib/auth-schemas'
import type { AuthApiResponse, Session, Workspace } from '@/types/auth'
import { cn } from '@/lib/utils'

function sessionFromResponse(res: AuthApiResponse): Session {
  return {
    user: res.user,
    workspace: res.workspace ?? res.workspaces?.[0],
    accessToken: res.accessToken,
    expiresAt: res.expiresAt,
  }
}

export function LoginManagerPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSession } = useAuth()
  const [oauthLoading, setOauthLoading] = useState<'github' | 'google' | null>(null)
  const [pendingResponse, setPendingResponse] = useState<AuthApiResponse | null>(null)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await authLogin({ email: data.email, password: data.password }) as AuthApiResponse
      const workspaces = res.workspaces ?? (res.workspace ? [res.workspace] : [])
      if (workspaces.length > 1) {
        setPendingResponse(res)
      } else {
        setSession(sessionFromResponse(res))
        toast.success('Welcome back')
        navigate(from, { replace: true })
      }
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    }
  }

  const handleOAuth = (provider: 'github' | 'google') => {
    setOauthLoading(provider)
    try {
      const url = getOAuthLoginUrl(provider)
      if (url) window.location.href = url
      else {
        toast.error('OAuth is not configured')
        setOauthLoading(null)
      }
    } catch {
      toast.error('OAuth is not configured')
      setOauthLoading(null)
    }
  }

  const handleSelectWorkspace = (ws: Workspace) => {
    if (!pendingResponse) return
    const session: Session = { ...sessionFromResponse(pendingResponse), workspace: ws }
    setSession(session)
    setPendingResponse(null)
    toast.success('Workspace selected')
    navigate(from, { replace: true })
  }

  const workspaces = pendingResponse?.workspaces ?? (pendingResponse?.workspace ? [pendingResponse.workspace] : [])

  if (pendingResponse && workspaces.length > 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-primary/5 via-transparent to-cyan/5" />
          <div className="absolute inset-0 bg-[rgb(var(--background))]" />
        </div>
        <AuthCard
          title="Select workspace"
          description="You belong to multiple teams. Choose which workspace to open."
        >
          <ul className="space-y-2" role="listbox" aria-label="Workspaces">
            {workspaces.map((ws) => (
              <li key={ws.id}>
                <button
                  type="button"
                  onClick={() => handleSelectWorkspace(ws)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-left transition-all duration-200',
                    'hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm hover:scale-[1.01]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  )}
                >
                  <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="flex-1 font-medium">{ws.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              </li>
            ))}
          </ul>
          <p className="text-center text-caption text-muted-foreground pt-2">
            <Link to="/login" className="text-primary hover:underline">
              Back to standard login
            </Link>
          </p>
        </AuthCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-primary/5 via-transparent to-cyan/5" />
        <div className="absolute inset-0 bg-[rgb(var(--background))]" />
      </div>
      <AuthCard
        title="Manager login"
        description="Log in with your manager account. Select a workspace if you're in multiple teams."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manager-email" className="text-body font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="manager-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email')}
                className={cn('pl-9', errors.email && 'border-destructive focus-visible:ring-destructive')}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <p className="text-caption text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="manager-password" className="text-body font-medium">
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-caption text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="manager-password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className={cn('pl-9', errors.password && 'border-destructive focus-visible:ring-destructive')}
                aria-invalid={!!errors.password}
              />
            </div>
            {errors.password && (
              <p className="text-caption text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full min-h-[44px] bg-gradient-to-r from-primary to-primary-orange hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
            isLoading={isSubmitting}
          >
            Log in as manager
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <span className="relative flex justify-center text-caption text-muted-foreground bg-card px-2">
            Or continue with
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            type="button"
            className="w-full min-h-[44px] hover:border-primary/50 hover:scale-[1.02] transition-all duration-200"
            disabled={!!oauthLoading}
            onClick={() => handleOAuth('github')}
          >
            {oauthLoading === 'github' ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <>
                <Github className="h-5 w-5" />
                GitHub
              </>
            )}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full min-h-[44px] hover:border-primary/50 hover:scale-[1.02] transition-all duration-200"
            disabled={!!oauthLoading}
            onClick={() => handleOAuth('google')}
          >
            {oauthLoading === 'google' ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              'Google'
            )}
          </Button>
        </div>
        <p className="text-center text-caption text-muted-foreground pt-2">
          <Link to="/login" className="text-primary hover:underline">
            Standard login
          </Link>
          {' · '}
          <Link to="/login/admin" className="text-muted-foreground hover:text-primary hover:underline">
            Admin login
          </Link>
        </p>
      </AuthCard>
    </div>
  )
}
