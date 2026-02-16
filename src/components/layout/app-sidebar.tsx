import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  BookOpen,
  Calendar,
  Wallet,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuthOptional } from '@/contexts/auth-context'

const SIDEBAR_STORAGE_KEY = 'atlas-sidebar-collapsed'

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/dashboard/content', label: 'Content Pipeline', icon: FileText },
  { to: '/dashboard/research', label: 'Research & KB', icon: BookOpen },
  { to: '/dashboard/calendar', label: 'Calendar & Travel', icon: Calendar },
  { to: '/dashboard/finance', label: 'Finance Cockpit', icon: Wallet },
  { to: '/dashboard/agents', label: 'Agent Builder', icon: Bot },
]

const bottomNav = [
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help', icon: HelpCircle },
]

const adminNav = [
  { to: '/dashboard/admin', label: 'Admin', icon: Shield },
]

export interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
  onMobileClose?: () => void
  isMobile?: boolean
}

export function AppSidebar({
  collapsed,
  onToggle,
  onMobileClose,
  isMobile = false,
}: AppSidebarProps) {
  const navigate = useNavigate()
  const auth = useAuthOptional()

  const navItem = (to: string, label: string, icon: typeof LayoutDashboard) => {
    const Icon = icon
    return (
      <NavLink
        key={to}
        to={to}
        onClick={isMobile ? onMobileClose : undefined}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body font-medium transition-colors',
            'hover:bg-muted hover:text-foreground',
            isActive
              ? 'bg-primary/10 text-primary border-l-2 border-primary -ml-[2px] pl-[14px]'
              : 'text-muted-foreground'
          )
        }
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>{label}</span>}
      </NavLink>
    )
  }

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-panel transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[56px]' : 'w-56',
        isMobile && 'fixed inset-y-0 left-0 z-50 w-64'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!collapsed && (
          <span className="font-semibold text-foreground">Atlas</span>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {mainNav.map(({ to, label, icon }) => navItem(to, label, icon))}
        <div className="my-2 border-t border-border" />
        {bottomNav.map(({ to, label, icon }) => navItem(to, label, icon))}
        {adminNav.map(({ to, label, icon }) => navItem(to, label, icon))}
        {auth?.isAuthenticated && (
          <>
            <div className="my-2 border-t border-border" />
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted',
                collapsed && 'justify-center px-0'
              )}
              onClick={() => {
                auth.logout()
                navigate('/', { replace: true })
                if (isMobile) onMobileClose?.()
              }}
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Log out</span>}
            </Button>
          </>
        )}
      </nav>
    </aside>
  )
}

export function getSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function setSidebarCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? 'true' : 'false')
  } catch {
    // ignore
  }
}
