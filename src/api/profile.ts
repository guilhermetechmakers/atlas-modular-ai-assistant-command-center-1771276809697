import { apiGet, apiPut, apiPost } from '@/lib/api'
import type {
  ProfileUpdatePayload,
  NotificationPreferences,
  ProfileWithWorkspace,
  ExportWorkspaceResponse,
  DeleteAccountPayload,
} from '@/types/profile'
import type { AuthApiResponse } from '@/types/auth'

const PROFILE_BASE = '/profile'
const AUTH_BASE = '/auth'

/**
 * Fetch full profile (user + workspace + notification preferences).
 * Falls back to auth me when profile endpoint is not available.
 */
export async function getProfile(): Promise<ProfileWithWorkspace | null> {
  try {
    const res = await apiGet<ProfileWithWorkspace>(`${PROFILE_BASE}/me`)
    return res
  } catch {
    try {
      const res = await apiGet<AuthApiResponse>(`${AUTH_BASE}/me`)
      if (res)
        return {
          user: res.user,
          workspace: res.workspace ?? null,
          workspaces: res.workspaces ?? [],
          notificationPreferences: {
            emailDigest: true,
            projectUpdates: true,
            calendarReminders: true,
            marketing: false,
          },
        }
    } catch {
      // ignore
    }
    return null
  }
}

/**
 * Update user profile (name, avatar).
 * Tries PUT /profile/me first, then PUT /auth/me for backends that only expose auth.
 */
export async function updateProfile(payload: ProfileUpdatePayload): Promise<AuthApiResponse> {
  try {
    const res = await apiPut<AuthApiResponse>(`${PROFILE_BASE}/me`, payload)
    return res
  } catch {
    const res = await apiPut<AuthApiResponse>(`${AUTH_BASE}/me`, payload)
    return res
  }
}

/**
 * Get notification preferences.
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences | null> {
  try {
    const res = await apiGet<NotificationPreferences>(`${PROFILE_BASE}/notifications`)
    return res
  } catch {
    return null
  }
}

/**
 * Update notification preferences.
 */
export async function updateNotificationPreferences(
  prefs: NotificationPreferences
): Promise<NotificationPreferences> {
  const res = await apiPut<NotificationPreferences>(`${PROFILE_BASE}/notifications`, prefs)
  return res
}

/**
 * Request workspace data export (returns download URL or message).
 */
export async function exportWorkspaceData(): Promise<ExportWorkspaceResponse> {
  const res = await apiPost<ExportWorkspaceResponse>(`${PROFILE_BASE}/export-workspace`)
  return res
}

/**
 * Delete account (requires password and confirmation).
 */
export async function deleteAccount(payload: DeleteAccountPayload): Promise<{ message: string }> {
  const res = await apiPost<{ message: string }>(`${PROFILE_BASE}/delete-account`, payload)
  return res
}
