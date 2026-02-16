import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PasswordStrength } from '@/components/auth/password-strength'
import { resetPassword, getAuthErrorMessage } from '@/api/auth'
import { passwordSchema } from '@/lib/auth-schemas'
import { cn } from '@/lib/utils'

const formSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof formSchema>

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const watchPassword = watch('password', '')

  const onSubmit = async (data: FormData) => {
    if (!token.trim()) {
      toast.error('Reset link is invalid or expired')
      return
    }
    try {
      await resetPassword(token, data.password)
      toast.success('Password updated. You can now sign in.')
      setSuccess(true)
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-primary/5 via-transparent to-cyan/5" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {!token.trim() ? (
          <Card className="border border-border/80 shadow-card bg-card/95 backdrop-blur-sm transition-all duration-300">
            <CardHeader className="text-center space-y-1.5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <AlertCircle className="h-6 w-6 text-amber-500" aria-hidden />
              </div>
              <CardTitle className="text-display font-bold">Invalid or missing link</CardTitle>
              <CardDescription className="text-muted-foreground">
                This password reset link is invalid or has expired. Request a new one below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="default" className="w-full min-h-[44px]">
                <Link to="/forgot-password">Request new reset link</Link>
              </Button>
              <Button asChild variant="outline" className="w-full min-h-[44px]">
                <Link to="/login">
                  <ArrowLeft className="h-4 w-4" />
                  Back to log in
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : success ? (
          <Card className="border border-border/80 shadow-card bg-card/95 backdrop-blur-sm transition-all duration-300">
            <CardHeader className="text-center space-y-1.5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-500" aria-hidden />
              </div>
              <CardTitle className="text-display font-bold">Password updated</CardTitle>
              <CardDescription className="text-muted-foreground">
                Your password has been changed. Sign in with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full min-h-[44px] bg-gradient-to-r from-primary to-primary-orange hover:opacity-90 hover:scale-[1.02] transition-all duration-200">
                <Link to="/login">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border/80 shadow-card bg-card/95 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
            <CardHeader className="text-center space-y-1.5">
              <CardTitle className="text-display font-bold">Set new password</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your new password below. Use at least 8 characters with a letter and a number.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-body font-medium">
                    New password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={cn(
                        'pl-9 transition-all duration-200',
                        errors.password && 'border-destructive focus-visible:ring-destructive'
                      )}
                      {...register('password')}
                      aria-invalid={!!errors.password}
                    />
                  </div>
                  <PasswordStrength password={watchPassword} />
                  {errors.password && (
                    <p className="text-caption text-destructive" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-body font-medium">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={cn(
                        'pl-9 transition-all duration-200',
                        errors.confirmPassword && 'border-destructive focus-visible:ring-destructive'
                      )}
                      {...register('confirmPassword')}
                      aria-invalid={!!errors.confirmPassword}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-caption text-destructive" role="alert">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full min-h-[44px] bg-gradient-to-r from-primary to-primary-orange hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                  isLoading={isSubmitting}
                >
                  Update password
                </Button>
              </form>
              <p className="mt-4 text-center text-caption text-muted-foreground">
                <Link
                  to="/login"
                  className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to log in
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
