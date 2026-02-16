import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProfile,
  updateProfile,
  updateNotificationPreferences,
  exportWorkspaceData,
  deleteAccount,
} from '@/api/profile'
import type { ProfileUpdatePayload, NotificationPreferences } from '@/types/profile'
import { DEFAULT_NOTIFICATION_PREFERENCES } from '@/types/profile'

export const profileQueryKey = ['profile'] as const

export function useProfile() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: getProfile,
    staleTime: 60 * 1000,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey })
    },
  })
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (prefs: NotificationPreferences) => updateNotificationPreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey })
    },
  })
}

export function useExportWorkspace() {
  return useMutation({
    mutationFn: exportWorkspaceData,
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey })
    },
  })
}

export { DEFAULT_NOTIFICATION_PREFERENCES }
