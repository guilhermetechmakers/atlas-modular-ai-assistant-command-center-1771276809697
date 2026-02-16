import { Link } from 'react-router-dom'
import { Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function VerifyEmailPage() {
  const handleResend = () => {
    // TODO: resend with rate limit
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="border-outline">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-display">Verify your email</CardTitle>
            <CardDescription>
              We’ve sent a verification link. Check your inbox and click the link to confirm your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleResend}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend verification
            </Button>
            <p className="text-center text-caption text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">Back to log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
