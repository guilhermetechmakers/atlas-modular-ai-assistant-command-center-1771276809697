import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { resendVerificationEmail, getAuthErrorMessage } from '@/api/auth'
import { cn } from '@/lib/utils'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const emailFromQuery = searchParams.get('email') ?? ''
  const [email, setEmail] = useState(emailFromQuery)
  const [isResending, setIsResending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    const toSend = email.trim()
    if (!toSend) return
    setIsResending(true)
    try {
      await resendVerificationEmail(toSend)
      setSent(true)
      toast.success('Verification email sent')
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    } finally {
      setIsResending(false)
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
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-display font-bold">Verify your email</CardTitle>
            <CardDescription className="text-muted-foreground">
              We’ve sent a verification link. Check your inbox and click the link to confirm your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sent && (
              <p className="text-body text-emerald-600 dark:text-emerald-400 text-center" role="status">
                Check your inbox for the verification link.
              </p>
            )}
            <form onSubmit={handleResend} className="space-y-3">
              <Label htmlFor="verify-email" className="text-body font-medium">
                Resend verification to
              </Label>
              <div className="flex gap-2">
                <Input
                  id="verify-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  autoComplete="email"
                />
                <Button
                  type="submit"
                  variant="outline"
                  disabled={!email.trim() || isResending}
                  isLoading={isResending}
                  className="shrink-0 min-h-[44px]"
                >
                  <RefreshCw className={cn('h-4 w-4', isResending && 'animate-spin')} />
                  Resend
                </Button>
              </div>
            </form>
            <p className="text-center text-caption text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                Back to log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
