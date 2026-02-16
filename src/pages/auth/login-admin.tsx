import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Shield, Lock, Mail, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { adminLogin, getAuthErrorMessage } from '@/api/auth'
import { adminLoginSchema, type AdminLoginFormData } from '@/lib/auth-schemas'
import { cn } from '@/lib/utils'

export function LoginAdminPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSessionFromResponse, isAuthenticated } = useAuth()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard/admin'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: '', password: '', totpCode: '' },
  })

  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const res = await adminLogin({
        email: data.email,
        password: data.password,
        totpCode: data.totpCode && data.totpCode.length === 6 ? data.totpCode : undefined,
      })
      setSessionFromResponse(res)
      toast.success('Admin access granted')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-primary/5 via-transparent to-cyan/5" />
        <div className="absolute -bottom-1/2 -right-1/2 h-full w-full bg-gradient-to-tl from-destructive/5 via-transparent to-primary/5" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="border border-border/80 shadow-card bg-card/95 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
          <CardHeader className="text-center space-y-1.5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-display font-bold">
              Admin login
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Secure login with elevated permissions. Use a strong password and 2FA if enabled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-body font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    className={cn(
                      'pl-9 transition-all duration-200',
                      errors.email && 'border-destructive focus-visible:ring-destructive'
                    )}
                    {...register('email')}
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
                <Label htmlFor="admin-password" className="text-body font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="12+ chars, upper, lower, number, special"
                    className={cn(
                      'pl-9 transition-all duration-200',
                      errors.password && 'border-destructive focus-visible:ring-destructive'
                    )}
                    {...register('password')}
                    aria-invalid={!!errors.password}
                  />
                </div>
                {errors.password && (
                  <p className="text-caption text-destructive" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-totp" className="text-body font-medium">
                  2FA code <span className="text-muted-foreground">(optional)</span>
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="admin-totp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    maxLength={6}
                    className={cn(
                      'pl-9 font-mono tracking-widest',
                      errors.totpCode && 'border-destructive focus-visible:ring-destructive'
                    )}
                    {...register('totpCode')}
                    aria-invalid={!!errors.totpCode}
                  />
                </div>
                {errors.totpCode && (
                  <p className="text-caption text-destructive" role="alert">
                    {errors.totpCode.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full min-h-[44px] bg-gradient-to-r from-primary to-primary-orange hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                isLoading={isSubmitting}
              >
                Log in as admin
              </Button>
            </form>

            <p className="text-center text-caption text-muted-foreground pt-2">
              <Link to="/login" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                Standard login
              </Link>
              {' · '}
              <Link to="/login/manager" className="text-muted-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                Manager login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
