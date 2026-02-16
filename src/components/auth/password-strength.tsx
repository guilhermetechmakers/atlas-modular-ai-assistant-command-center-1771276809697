import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { getPasswordStrength } from '@/lib/auth-schemas'

interface PasswordStrengthProps {
  password: string
  className?: string
}

/** Inline password strength indicator (bars + label) */
export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const { label, score } = useMemo(() => getPasswordStrength(password), [password])

  if (!password) return null

  return (
    <div className={cn('flex items-center gap-2', className)} role="status" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              'h-1 w-6 rounded-full transition-colors duration-200',
              i < score
                ? score <= 2
                  ? 'bg-destructive'
                  : score === 3
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                : 'bg-muted'
            )}
          />
        ))}
      </div>
      {label && (
        <span
          className={cn(
            'text-caption',
            score <= 2 ? 'text-destructive' : score === 3 ? 'text-amber-500' : 'text-emerald-600'
          )}
        >
          {label}
        </span>
      )}
    </div>
  )
}
