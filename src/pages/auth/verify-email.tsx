import { useState, useEffect } from 'react'
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { resendVerificationEmail, getAuthErrorMessage } from '@/api/auth'
import { useAuthOptional } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

const RESEND_COOLDOWN_SEC = 60

const resendSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ResendFormData = z.infer<typeof resendSchema>

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAuthOptional()

  const stateEmail = (location.state as { email?: string } | null)?.email
  const emailFromQuery = searchParams.get('email') ?? ''
  const sessionEmail = auth?.user?.email ?? ''

  const defaultEmail = stateEmail || emailFromQuery || sessionEmail || ''

  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
    defaultValues: { email: defaultEmail },
  })

  const emailValue = watch('email', defaultEmail)

  useEffect(() => {
    if (defaultEmail) setValue('email', defaultEmail)
  }, [defaultEmail, setValue])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const handleResend = async (data: ResendFormData) => {
    const toSend = data.email.trim()
    if (!toSend) return
    try {
      await resendVerificationEmail(toSend)
      setSent(true)
      setCooldown(RESEND_COOLDOWN_SEC)
      toast.success('Verification email sent')
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    }
  }

  const handleContinue = async () => {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'
    setIsRefreshing(true)
    try {
      if (auth?.refreshSession) await auth.refreshSession()
      navigate(from, { replace: true })
      toast.success('Welcome back!')
    } catch {
      navigate(from, { replace: true })
    } finally {
      setIsRefreshing(false)
    }
  }

  const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'
  const isLoggedIn = auth?.isAuthenticated === true

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-cyan/10 animate-fade-in" />
        <div className="absolute inset-0 bg-[rgb(var(--background))]" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <Card
          className={cn(
            'border border-border/80 shadow-card bg-card/95 backdrop-blur-sm',
            'transition-all duration-300 hover:shadow-card-hover hover:border-primary/20',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background'
          )}
        >
          <CardHeader className="text-center space-y-1.5">
            <div
              className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
              aria-hidden
            >
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-display font-bold bg-gradient-to-r from-primary to-primary-orange bg-clip-text text-transparent">
              Verify your email
            </CardTitle>
            <CardDescription className="text-muted-foreground text-body max-w-sm mx-auto">
              We&apos;ve sent a verification link to your inbox. Click the link to confirm your account and continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sent && (
              <div
                className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-emerald-300 text-body"
                role="status"
                aria-live="polite"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Check your inbox for the verification link. You can resend in {cooldown > 0 ? `${cooldown}s` : 'a moment'}.</span>
              </div>
            )}

            <form onSubmit={handleSubmit(handleResend)} className="space-y-3">
              <Label htmlFor="verify-email" className="text-body font-medium">
                Resend verification email to
              </Label>
              <div className="flex gap-2">
                <Input
                  id="verify-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={cn(
                    'flex-1 transition-all duration-200',
                    errors.email && 'border-destructive focus-visible:ring-destructive'
                  )}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'verify-email-error' : undefined}
                  {...register('email')}
                />
                <Button
                  type="submit"
                  variant="outline"
                  disabled={!emailValue.trim() || isSubmitting || cooldown > 0}
                  isLoading={isSubmitting}
                  className="shrink-0 min-h-[44px] min-w-[44px] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                >
                  <RefreshCw className={cn('h-4 w-4', isSubmitting && 'animate-spin')} />
                  <span className="sr-only sm:not-sr-only sm:ml-1">Resend</span>
                </Button>
              </div>
              {errors.email && (
                <p id="verify-email-error" className="text-caption text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
              {cooldown > 0 && !errors.email && (
                <p className="text-caption text-muted-foreground">
                  Resend available in <span className="font-medium tabular-nums">{cooldown}</span> seconds
                </p>
              )}
            </form>

            <div className="space-y-3 pt-2 border-t border-border">
              {isLoggedIn ? (
                <Button
                  type="button"
                  variant="default"
                  className="w-full min-h-[44px] bg-gradient-to-r from-primary to-primary-orange hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                  onClick={handleContinue}
                  disabled={isRefreshing}
                  isLoading={isRefreshing}
                >
                  I&apos;ve verified my email
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : null}
              <p className="text-center text-caption text-muted-foreground">
                <Link
                  to="/login"
                  className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                >
                  Back to log in
                </Link>
                {isLoggedIn && (
                  <>
                    {' · '}
                    <Link
                      to={fromPath}
                      className="text-muted-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      Dashboard
                    </Link>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-caption text-muted-foreground max-w-sm mx-auto">
          Didn&apos;t receive the email? Check spam or promotions, and ensure you entered the correct address.
        </p>
      </div>
    </div>
  )
}
