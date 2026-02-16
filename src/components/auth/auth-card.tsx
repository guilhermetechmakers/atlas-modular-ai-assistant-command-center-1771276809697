import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AuthCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/** Shared auth layout: centered card with gradient border accent and consistent spacing */
export function AuthCard({ title, description, children, className }: AuthCardProps) {
  return (
    <div className={cn('w-full max-w-md animate-fade-in-up', className)}>
      <Card className="border-outline overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/30">
        <div className="from-primary/5 to-transparent h-1 w-full bg-gradient-to-r" aria-hidden />
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-display font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-body mt-1">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  )
}
