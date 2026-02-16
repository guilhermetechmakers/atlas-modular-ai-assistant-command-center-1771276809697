import * as React from 'react'
import { cn } from '@/lib/utils'

function getInitials(name: string | undefined, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2)
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }
  const local = email.split('@')[0]
  return local.slice(0, 2).toUpperCase()
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  name?: string
  email?: string
  fallback?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, email = '', fallback, className, ...props }, ref) => {
    const initials = fallback ?? getInitials(name, email)
    const [imgError, setImgError] = React.useState(false)
    const showImg = src && !imgError

    return (
      <div
        ref={ref}
        role="img"
        aria-label={alt ?? name ?? 'User avatar'}
        className={cn(
          'relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-primary font-medium transition-all duration-200',
          'ring-2 ring-border',
          className
        )}
        {...props}
      >
        {showImg ? (
          <img
            src={src}
            alt={alt ?? ''}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-body">{initials}</span>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar }
