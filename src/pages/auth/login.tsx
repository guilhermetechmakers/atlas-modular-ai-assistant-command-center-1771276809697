import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Github, Mail, Lock, Shield, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { getAuthErrorMessage, getOAuthLoginUrl } from '@/api/auth'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [oauthLoading, setOauthLoading] = useState<'github' | 'google' | null>(null)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'
  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await login(data.email, data.password)
      if (res.user.emailVerified === false) {
        navigate('/verify-email', { state: { from: { pathname: from }, email: res.user.email }, replace: true })
        toast.info('Please verify your email to continue')
        return
      }
      toast.success('Welcome back')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    }
  }

  const handleOAuth = (provider: 'github' | 'google') => {
    setOauthLoading(provider)
    try {
      const url = getOAuthLoginUrl(provider)
      window.location.href = url
    } catch {
      toast.error('OAuth is not configured')
      setOauthLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-primary/5 via-transparent to-cyan/5" />
        <div className="absolute inset-0 bg-[rgb(var(--background))]" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="border border-border/80 shadow-card bg-card/95 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
          <CardHeader className="text-center space-y-1.5">
            <CardTitle className="text-display font-bold bg-gradient-to-r from-primary to-primary-orange bg-clip-text text-transparent">
              Log in to Atlas
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Use your email and password or sign in with a provider.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-body font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={cn(
                      'pl-9 transition-all duration-200',
                      errors.email && 'border-destructive focus-visible:ring-destructive'
                    )}
                    {...register('email')}
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
                  <Label htmlFor="password" className="text-body font-medium">
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
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={cn(
                      'pl-9 transition-all duration-200',
                      errors.password && 'border-destructive focus-visible:ring-destructive'
                    )}
                    {...register('password')}
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
                Log in
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
                onClick={() => handleOAuth('github')}
                disabled={oauthLoading !== null}
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
                onClick={() => handleOAuth('google')}
                disabled={oauthLoading !== null}
              >
                {oauthLoading === 'google' ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  'Google'
                )}
              </Button>
            </div>

            <p className="text-center text-caption text-muted-foreground">
              No account?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                Sign up
              </Link>
            </p>

            <div className="pt-4 border-t border-border flex flex-wrap items-center justify-center gap-3 text-caption text-muted-foreground">
              <Link
                to="/login/manager"
                className="inline-flex items-center gap-1.5 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <UserCog className="h-4 w-4" />
                Manager login
              </Link>
              <span aria-hidden>·</span>
              <Link
                to="/login/admin"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <Shield className="h-4 w-4" />
                Admin login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
