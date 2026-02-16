import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { AuthApiResponse, Session, User, Workspace } from '@/types/auth'
import * as authApi from '@/api/auth'

interface AuthContextValue {
  session: Session | null
  user: User | null
  workspace: Workspace | null
  workspaces: Workspace[]
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<AuthApiResponse>
  signup: (email: string, password: string, workspaceName: string, name?: string) => Promise<AuthApiResponse>
  logout: () => Promise<void>
  selectWorkspace: (workspace: Workspace) => void
  setSession: (session: Session | null) => void
  setSessionFromResponse: (res: AuthApiResponse) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const SESSION_KEY = 'atlas-auth-session'

function readStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Session
    if (!data?.user) return null
    return data
  } catch {
    return null
  }
}

function writeStoredSession(session: Session | null): void {
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  } catch {
    // ignore
  }
}

/** Build Session from API response (exported for admin/manager pages that call API directly). */
export function sessionFromResponse(res: AuthApiResponse): Session {
  return {
    user: res.user,
    workspace: res.workspace ?? res.workspaces?.[0],
    workspaces: res.workspaces,
    accessToken: res.accessToken,
    expiresAt: res.expiresAt,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setSession = useCallback((next: Session | null) => {
    setSessionState(next)
    writeStoredSession(next)
  }, [])

  useEffect(() => {
    setSessionState(readStoredSession())
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<AuthApiResponse> => {
      const res = await authApi.login({ email, password })
      setSession(sessionFromResponse(res))
      return res
    },
    [setSession]
  )

  const signup = useCallback(
    async (email: string, password: string, workspaceName: string, name?: string): Promise<AuthApiResponse> => {
      const res = await authApi.signup({ email, password, workspace: workspaceName, name })
      setSession(sessionFromResponse(res))
      return res
    },
    [setSession]
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    }
    setSession(null)
  }, [setSession])

  const selectWorkspace = useCallback((workspace: Workspace) => {
    setSessionState((prev) => {
      if (!prev) return prev
      const next: Session = { ...prev, workspace }
      writeStoredSession(next)
      return next
    })
  }, [])

  const setSessionFromResponse = useCallback(
    (res: AuthApiResponse) => setSession(sessionFromResponse(res)),
    [setSession]
  )

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    workspace: session?.workspace ?? null,
    workspaces: session?.workspaces ?? [],
    isLoading,
    isAuthenticated: !!session?.user,
    login,
    signup,
    logout,
    selectWorkspace,
    setSession,
    setSessionFromResponse,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useAuthOptional(): AuthContextValue | null {
  return useContext(AuthContext)
}
