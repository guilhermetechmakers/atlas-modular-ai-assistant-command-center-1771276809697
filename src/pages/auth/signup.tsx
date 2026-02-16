import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  workspace: z.string().min(1, 'Workspace name required'),
})

type FormData = z.infer<typeof schema>

export function SignupPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: FormData) => {
    // TODO: call auth API + workspace creation
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="border-outline">
          <CardHeader className="text-center">
            <CardTitle className="text-display">Create your workspace</CardTitle>
            <CardDescription>Sign up and name your Atlas workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 8 characters"
                  {...register('password')}
                  className={cn(errors.password && 'border-destructive focus-visible:ring-destructive')}
                />
                {errors.password && (
                  <p className="text-caption text-destructive">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace name</Label>
                <Input
                  id="workspace"
                  placeholder="My Workspace"
                  {...register('workspace')}
                  className={cn(errors.workspace && 'border-destructive focus-visible:ring-destructive')}
                />
                {errors.workspace && (
                  <p className="text-caption text-destructive">{errors.workspace.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Get Started
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative flex justify-center text-caption text-muted-foreground">
                Or continue with
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" className="w-full">
                GitHub
              </Button>
              <Button variant="outline" type="button" className="w-full">
                Google
              </Button>
            </div>
            <p className="text-center text-caption text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
