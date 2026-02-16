import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { forgotPassword, getAuthErrorMessage } from '@/api/auth'
import { cn } from '@/lib/utils'

const schema = z.object({ email: z.string().email('Please enter a valid email') })
type FormData = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await forgotPassword(data.email)
      setSubmitted(true)
      toast.success('Check your email for a reset link')
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
        <Card className="border border-border/80 shadow-card bg-card/95 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
          <CardHeader className="text-center space-y-1.5">
            {submitted ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <CardTitle className="text-display font-bold">Check your email</CardTitle>
                <CardDescription className="text-muted-foreground">
                  If an account exists for that address, we’ve sent a link to set a new password. Check your inbox and click the link to continue.
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-display font-bold">Reset password</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Enter your email and we’ll send a reset link.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4">
                <Button asChild variant="outline" className="w-full min-h-[44px]">
                  <Link to="/login">Back to log in</Link>
                </Button>
                <p className="text-center text-caption text-muted-foreground">
                  Didn’t get the email?{' '}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Try again
                  </button>
                </p>
              </div>
            ) : (
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
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-caption text-destructive" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full min-h-[44px]" isLoading={isSubmitting}>
                  Send reset link
                </Button>
              </form>
            )}
            {!submitted && (
              <p className="mt-4 text-center text-caption text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                  Back to log in
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
