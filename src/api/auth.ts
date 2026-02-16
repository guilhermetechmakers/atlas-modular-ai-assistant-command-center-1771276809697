import { apiGet, apiPost, type ApiError } from '@/lib/api'
import type {
  AuthApiResponse,
  ForgotPasswordResponse,
  LoginCredentials,
  ResetPasswordResponse,
  SignupCredentials,
  VerifyEmailResponse,
  Workspace,
} from '@/types/auth'

const AUTH_BASE = '/auth'

/**
 * Log in with email and password.
 * Returns user and optional workspace list for manager flow.
 */
export async function login(credentials: LoginCredentials): Promise<AuthApiResponse> {
  const res = await apiPost<AuthApiResponse>(`${AUTH_BASE}/login`, credentials)
  return res
}

/**
 * Sign up with email, password, and workspace name.
 */
export async function signup(credentials: SignupCredentials): Promise<AuthApiResponse> {
  const res = await apiPost<AuthApiResponse>(`${AUTH_BASE}/signup`, credentials)
  return res
}

/**
 * Log out (clears server session when backend supports it).
 */
export async function logout(): Promise<void> {
  await apiPost(`${AUTH_BASE}/logout`)
}

/**
 * Request password reset email.
 */
export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const res = await apiPost<ForgotPasswordResponse>(`${AUTH_BASE}/forgot-password`, { email })
  return res
}

/**
 * Set new password using the token from the reset link.
 */
export async function resetPassword(token: string, password: string): Promise<ResetPasswordResponse> {
  const res = await apiPost<ResetPasswordResponse>(`${AUTH_BASE}/reset-password`, { token, password })
  return res
}

/**
 * Resend verification email.
 */
export async function resendVerificationEmail(email: string): Promise<VerifyEmailResponse> {
  const res = await apiPost<VerifyEmailResponse>(`${AUTH_BASE}/resend-verification`, { email })
  return res
}

/**
 * Fetch workspaces for the current user (e.g. after manager login).
 */
export async function getWorkspaces(): Promise<Workspace[]> {
  const res = await apiGet<{ workspaces: Workspace[] }>(`${AUTH_BASE}/workspaces`)
  return res.workspaces ?? []
}

/**
 * Admin login with optional 2FA code.
 */
export async function adminLogin(credentials: LoginCredentials & { totpCode?: string }): Promise<AuthApiResponse> {
  const res = await apiPost<AuthApiResponse>(`${AUTH_BASE}/admin/login`, credentials)
  return res
}

/**
 * Get OAuth authorization URL for a provider (GitHub, Google).
 * Frontend redirects to this URL; callback is handled by backend.
 */
export function getOAuthLoginUrl(provider: 'github' | 'google'): string {
  const base = import.meta.env.VITE_API_URL ?? ''
  return `${base.replace(/\/$/, '')}/auth/oauth/${provider}`
}

/** Helper to normalize API errors for toast messages */
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as ApiError).message)
  }
  return 'Something went wrong. Please try again.'
}
