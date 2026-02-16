import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  User,
  Bell,
  Plug,
  Download,
  AlertTriangle,
  ChevronLeft,
  Mail,
  Building2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { useAuth } from '@/contexts/auth-context'
import {
  useProfile,
  useUpdateProfile,
  useUpdateNotificationPreferences,
  useExportWorkspace,
  useDeleteAccount,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from '@/hooks/use-profile'
import type { NotificationPreferences } from '@/types/profile'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
})

type ProfileFormData = z.infer<typeof profileSchema>

const deleteAccountSchema = z
  .object({
    password: z.string().min(1, 'Password is required'),
    confirmation: z.string(),
  })
  .refine((d) => d.confirmation === 'DELETE', {
    message: 'Type DELETE to confirm',
    path: ['confirmation'],
  })

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>

export function ProfilePage() {
  const navigate = useNavigate()
  const { user: authUser, refreshSession, logout } = useAuth()
  const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const updateNotificationsMutation = useUpdateNotificationPreferences()
  const exportMutation = useExportWorkspace()
  const deleteAccountMutation = useDeleteAccount()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [localNotifications, setLocalNotifications] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES
  )
  const [notificationTouched, setNotificationTouched] = useState(false)

  const user = profile?.user ?? authUser ?? null
  const notificationPreferences = profile?.notificationPreferences ?? DEFAULT_NOTIFICATION_PREFERENCES

  useEffect(() => {
    setLocalNotifications(notificationPreferences)
  }, [notificationPreferences])

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  })

  useEffect(() => {
    if (user?.name !== undefined) {
      setValue('name', user.name ?? '')
    }
  }, [user?.name, setValue])

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync({ name: data.name })
      await refreshSession()
      reset(data)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile')
    }
  }

  const onSaveNotifications = async () => {
    try {
      await updateNotificationsMutation.mutateAsync(localNotifications)
      setNotificationTouched(false)
      toast.success('Notification preferences saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save preferences')
    }
  }

  const onExport = async () => {
    try {
      const res = await exportMutation.mutateAsync()
      if (res.downloadUrl) {
        window.open(res.downloadUrl, '_blank')
        toast.success('Export ready')
      } else {
        toast.success(res.message || 'Export requested')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed')
    }
  }

  const handleNotificationChange = (key: keyof NotificationPreferences, value: boolean) => {
    setLocalNotifications((p) => ({ ...p, [key]: value }))
    setNotificationTouched(true)
  }

  const {
    register: registerDelete,
    handleSubmit: handleDeleteSubmit,
    formState: { errors: deleteErrors },
    reset: resetDelete,
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: '', confirmation: '' },
  })

  const onDeleteAccount = async (data: DeleteAccountFormData) => {
    try {
      await deleteAccountMutation.mutateAsync({
        password: data.password,
        confirmation: data.confirmation,
      })
      setDeleteDialogOpen(false)
      toast.success('Account deleted')
      logout()
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete account')
    }
  }

  const openDeleteDialog = () => {
    resetDelete({ password: '', confirmation: '' })
    setDeleteDialogOpen(true)
  }

  if (profileError && !authUser) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
            <CardDescription>
              We couldn't load your profile. Please refresh the page or try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Link
          to="/dashboard/settings"
          className="inline-flex items-center gap-1 text-body text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Settings
        </Link>
        <h1 className="text-display font-bold text-foreground">Profile & workspace</h1>
        <p className="text-body text-muted-foreground">
          Manage your account details, notifications, integrations, and data.
        </p>
      </div>

      {/* Profile details */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile details
          </CardTitle>
          <CardDescription>Avatar, display name, and email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {profileLoading && !user ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <Avatar
                  name={user?.name}
                  email={user?.email ?? ''}
                  className="h-16 w-16 text-lg"
                />
                <div className="flex-1 space-y-4">
                  <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Display name</Label>
                      <Input
                        id="profile-name"
                        placeholder="Your name"
                        {...register('name')}
                        className={cn(errors.name && 'border-destructive focus-visible:ring-destructive')}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p className="text-caption text-destructive" role="alert">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        value={user?.email ?? ''}
                        readOnly
                        disabled
                        className="bg-muted/50 cursor-not-allowed"
                        aria-label="Email (read-only)"
                      />
                      <p className="text-caption text-muted-foreground">
                        Email cannot be changed here. Contact support if needed.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={!isDirty || updateProfileMutation.isPending}
                      isLoading={updateProfileMutation.isPending}
                      className="mt-2"
                    >
                      Save changes
                    </Button>
                  </form>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Workspace membership */}
      {profile?.workspace && (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Workspace
            </CardTitle>
            <CardDescription>Current workspace and membership.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
              <span className="font-medium text-foreground">{profile.workspace.name}</span>
              {profile.workspaces.length > 1 && (
                <span className="text-caption text-muted-foreground">
                  {profile.workspaces.length} workspaces
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Choose how you receive updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {profileLoading && !user ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Email digest</p>
                    <p className="text-caption text-muted-foreground">Weekly summary of activity</p>
                  </div>
                  <Switch
                    checked={localNotifications.emailDigest}
                    onCheckedChange={(v) => handleNotificationChange('emailDigest', v)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Project updates</p>
                    <p className="text-caption text-muted-foreground">When projects you follow change</p>
                  </div>
                  <Switch
                    checked={localNotifications.projectUpdates}
                    onCheckedChange={(v) => handleNotificationChange('projectUpdates', v)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Calendar reminders</p>
                    <p className="text-caption text-muted-foreground">Upcoming events and travel</p>
                  </div>
                  <Switch
                    checked={localNotifications.calendarReminders}
                    onCheckedChange={(v) => handleNotificationChange('calendarReminders', v)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Marketing</p>
                    <p className="text-caption text-muted-foreground">Product news and tips</p>
                  </div>
                  <Switch
                    checked={localNotifications.marketing}
                    onCheckedChange={(v) => handleNotificationChange('marketing', v)}
                  />
                </div>
              </div>
              {notificationTouched && (
                <Button
                  onClick={onSaveNotifications}
                  disabled={updateNotificationsMutation.isPending}
                  isLoading={updateNotificationsMutation.isPending}
                >
                  Save notification preferences
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            Integrations
          </CardTitle>
          <CardDescription>GitHub, Google Calendar, and other connectors.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border bg-muted/20 px-6 py-8 text-center">
            <Plug className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-body font-medium text-foreground">No integrations connected</p>
            <p className="mt-1 text-caption text-muted-foreground">
              Connect your tools to sync projects and calendar.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/dashboard/settings">Manage integrations</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export & backup
          </CardTitle>
          <CardDescription>Download a copy of your workspace data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={onExport}
            disabled={exportMutation.isPending}
            isLoading={exportMutation.isPending}
            className="transition-transform hover:scale-[1.02]"
          >
            Export workspace data
          </Button>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="overflow-hidden border-destructive/30 transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={openDeleteDialog}>
            Delete account
          </Button>
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete account"
        description="This will permanently remove your account and all data. Type DELETE below and enter your password to confirm."
        actionLabel="Delete account"
        actionVariant="destructive"
        actionLoading={deleteAccountMutation.isPending}
        formId="delete-account-form"
        cancelLabel="Cancel"
      >
        <form
          id="delete-account-form"
          onSubmit={handleDeleteSubmit(onDeleteAccount)}
          className="mt-4 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="delete-confirmation">Type DELETE to confirm</Label>
            <Input
              id="delete-confirmation"
              placeholder="DELETE"
              {...registerDelete('confirmation')}
              className={cn(deleteErrors.confirmation && 'border-destructive')}
              autoComplete="off"
            />
            {deleteErrors.confirmation && (
              <p className="text-caption text-destructive" role="alert">
                {deleteErrors.confirmation.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="delete-password">Your password</Label>
            <Input
              id="delete-password"
              type="password"
              placeholder="Password"
              {...registerDelete('password')}
              className={cn(deleteErrors.password && 'border-destructive')}
            />
            {deleteErrors.password && (
              <p className="text-caption text-destructive" role="alert">
                {deleteErrors.password.message}
              </p>
            )}
          </div>
        </form>
      </AlertDialog>
    </div>
  )
}
