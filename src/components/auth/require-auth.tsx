import { Navigate, useLocation } from 'react-router-dom'
import { useAuthOptional } from '@/contexts/auth-context'

interface RequireAuthProps {
  children: React.ReactNode
  /** Where to send unauthenticated users (default: /login) */
  loginPath?: string
}

/**
 * Protects dashboard (or any) routes: redirects to login if no session,
 * and to verify-email if session exists but email is not verified.
 */
export function RequireAuth({ children, loginPath = '/login' }: RequireAuthProps) {
  const auth = useAuthOptional()
  const location = useLocation()

  if (!auth) return <>{children}</>
  if (auth.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
      </div>
    )
  }
  if (!auth.session) {
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }
  if (!auth.isEmailVerified) {
    return (
      <Navigate
        to="/verify-email"
        state={{ from: location, email: auth.user?.email }}
        replace
      />
    )
  }
  return <>{children}</>
}
