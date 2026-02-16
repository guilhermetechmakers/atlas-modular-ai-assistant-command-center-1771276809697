import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const schema = z.object({ email: z.string().email('Invalid email') })
type FormData = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: FormData) => {
    // TODO: request reset API
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="border-outline">
          <CardHeader className="text-center">
            <CardTitle className="text-display">Reset password</CardTitle>
            <CardDescription>Enter your email and we’ll send a reset link.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={cn(errors.email && 'border-destructive focus-visible:ring-destructive')}
                />
                {errors.email && (
                  <p className="text-caption text-destructive">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Send reset link
              </Button>
            </form>
            <p className="mt-4 text-center text-caption text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">Back to log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
