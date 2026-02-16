/** Profile and workspace settings types */

import type { User, Workspace } from '@/types/auth'

export interface ProfileUpdatePayload {
  name?: string
  /** Avatar URL; backend may support upload and return URL */
  avatarUrl?: string
}

export interface NotificationPreferences {
  emailDigest: boolean
  projectUpdates: boolean
  calendarReminders: boolean
  marketing: boolean
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  emailDigest: true,
  projectUpdates: true,
  calendarReminders: true,
  marketing: false,
}

export interface ProfileWithWorkspace {
  user: User
  workspace: Workspace | null
  workspaces: Workspace[]
  notificationPreferences: NotificationPreferences
}

export interface ExportWorkspaceResponse {
  downloadUrl?: string
  message: string
}

export interface DeleteAccountPayload {
  password: string
  confirmation: string
}
