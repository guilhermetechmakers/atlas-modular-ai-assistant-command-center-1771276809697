import { useState, useCallback, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Menu, FileText } from 'lucide-react'
import { AppSidebar, getSidebarCollapsed, setSidebarCollapsed } from '@/components/layout/app-sidebar'
import { GlobalSearch } from '@/components/global-search/global-search'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(getSidebarCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleSidebar = useCallback(() => {
    setCollapsed((c) => {
      const next = !c
      setSidebarCollapsed(next)
      return next
    })
  }, [])

  useEffect(() => {
    setCollapsed(getSidebarCollapsed())
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar
          collapsed={collapsed}
          onToggle={toggleSidebar}
          isMobile={false}
        />
      </div>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}
      <div className={cn('md:hidden', mobileOpen && 'fixed inset-y-0 left-0 z-50')}>
        <AppSidebar
          collapsed={false}
          onToggle={() => {}}
          onMobileClose={() => setMobileOpen(false)}
          isMobile={true}
        />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-panel px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/audit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Audit</span>
            </Link>
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
