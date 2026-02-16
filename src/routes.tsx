import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/auth/login'
import { SignupPage } from '@/pages/auth/signup'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password'
import { VerifyEmailPage } from '@/pages/auth/verify-email'
import { DashboardOverview } from '@/pages/dashboard/overview'
import { ProjectsPage } from '@/pages/dashboard/projects'
import { ContentPipelinePage } from '@/pages/dashboard/content'
import { ContentNewPage } from '@/pages/dashboard/content-new'
import { ResearchPage } from '@/pages/dashboard/research'
import { CalendarPage } from '@/pages/dashboard/calendar'
import { FinancePage } from '@/pages/dashboard/finance'
import { AgentsPage } from '@/pages/dashboard/agents'
import { SettingsPage } from '@/pages/dashboard/settings'
import { AdminPage } from '@/pages/dashboard/admin'
import { AuditPage } from '@/pages/dashboard/audit'
import { HelpPage } from '@/pages/help'
import { NotFoundPage } from '@/pages/errors/not-found'
import { ServerErrorPage } from '@/pages/errors/server-error'
import { PrivacyPage } from '@/pages/legal/privacy'
import { TermsPage } from '@/pages/legal/terms'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/help', element: <HelpPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/terms', element: <TermsPage /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'content', element: <ContentPipelinePage /> },
      { path: 'content/new', element: <ContentNewPage /> },
      { path: 'research', element: <ResearchPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'agents', element: <AgentsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'audit', element: <AuditPage /> },
    ],
  },
  { path: '/500', element: <ServerErrorPage /> },
  { path: '*', element: <NotFoundPage /> },
])
