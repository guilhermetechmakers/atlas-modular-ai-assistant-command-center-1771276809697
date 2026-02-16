import { Navigate, useLocation } from 'react-router-dom'
import { useAuthOptional } from '@/contexts/auth-context'

interface RequireAuthProps {
  children: React.ReactNode
  /** Where to send unauthenticated users (default: /login) */
  loginPath?: string
}

/**
 * Protects dashboard (or any) routes: redirects to login if no session.
 * When backend is not available, auth may be skipped for demo (session in localStorage).
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
  return <>{children}</>
}
