/** Auth-related types for login, signup, and session */

export interface User {
  id: string
  email: string
  name?: string
  role: 'user' | 'manager' | 'admin'
  emailVerified?: boolean
}

export interface Workspace {
  id: string
  name: string
  slug?: string
}

export interface Session {
  user: User
  workspace?: Workspace
  workspaces?: Workspace[]
  accessToken?: string
  expiresAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  workspace: string
  name?: string
}

export interface AuthApiResponse {
  user: User
  workspace?: Workspace
  workspaces?: Workspace[]
  accessToken?: string
  expiresAt?: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface VerifyEmailResponse {
  message: string
}

export interface ResetPasswordResponse {
  message: string
}
