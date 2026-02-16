import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Redirect path when unauthenticated */
  loginPath?: string
}

/**
 * Wraps content that requires authentication. Redirects to login when not authenticated.
 * Shows a loading skeleton while auth state is loading.
 */
export function ProtectedRoute({ children, loginPath = '/login' }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6" aria-busy="true">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-24 rounded-card" />
          <Skeleton className="h-24 rounded-card" />
        </div>
        <Skeleton className="h-64 rounded-card" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={loginPath}
        state={{ from: location }}
        replace
      />
    )
  }

  return <>{children}</>
}
