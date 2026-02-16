import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Github, Mail, Lock, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PasswordStrength } from '@/components/auth/password-strength'
import { useAuth } from '@/contexts/auth-context'
import { getAuthErrorMessage, getOAuthLoginUrl } from '@/api/auth'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  workspace: z.string().min(1, 'Workspace name is required').max(64, 'Workspace name is too long'),
  name: z.string().max(128).optional(),
})

type FormData = z.infer<typeof schema>

export function SignupPage() {
  const navigate = useNavigate()
  const { signup, isAuthenticated } = useAuth()
  const [oauthLoading, setOauthLoading] = useState<'github' | 'google' | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', workspace: '', name: '' },
  })

  const watchPassword = watch('password', '')

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const onSubmit = async (data: FormData) => {
    try {
      const res = await signup(data.email, data.password, data.workspace, data.name || undefined)
      if (res.user.emailVerified === false) {
        navigate('/verify-email', { state: { email: res.user.email }, replace: true })
        toast.info('Please verify your email to continue')
        return
      }
      toast.success('Account created. Welcome to Atlas!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    }
  }

  const handleOAuth = (provider: 'github' | 'google') => {
    setOauthLoading(provider)
    try {
      window.location.href = getOAuthLoginUrl(provider)
    } catch {
      toast.error('OAuth is not configured')
      setOauthLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 h-full w-full bg-gradient-to-bl from-primary/5 via-transparent to-purple/5" />
        <div className="absolute inset-0 bg-[rgb(var(--background))]" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="border border-border/80 shadow-card bg-card/95 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
          <CardHeader className="text-center space-y-1.5">
            <CardTitle className="text-display font-bold bg-gradient-to-r from-primary to-primary-orange bg-clip-text text-transparent">
              Create your workspace
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign up and name your Atlas workspace to get started.
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
                <Label htmlFor="password" className="text-body font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    className={cn(
                      'pl-9 transition-all duration-200',
                      errors.password && 'border-destructive focus-visible:ring-destructive'
                    )}
                    {...register('password')}
                  />
                </div>
                <PasswordStrength password={watchPassword} className="mt-1" />
                {errors.password && (
                  <p className="text-caption text-destructive" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace" className="text-body font-medium">
                  Workspace name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="workspace"
                    placeholder="My Workspace"
                    autoComplete="organization"
                    className={cn(
                      'pl-9 transition-all duration-200',
                      errors.workspace && 'border-destructive focus-visible:ring-destructive'
                    )}
                    {...register('workspace')}
                  />
                </div>
                {errors.workspace && (
                  <p className="text-caption text-destructive" role="alert">
                    {errors.workspace.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-body font-medium">
                  Full name <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className={cn(errors.name && 'border-destructive focus-visible:ring-destructive')}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-caption text-destructive" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full min-h-[44px] bg-gradient-to-r from-primary to-primary-orange hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                isLoading={isSubmitting}
              >
                Get Started
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
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Log in
              </Link>
            </p>
            <p className="text-center text-caption text-muted-foreground pt-2">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Back to home
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
