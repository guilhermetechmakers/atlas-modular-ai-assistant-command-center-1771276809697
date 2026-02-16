import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/auth-context'
import { router } from '@/routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: 'bg-card border border-border text-card-foreground',
            success: 'border-emerald-500/50',
            error: 'border-destructive/50',
          },
        }}
      />
      </AuthProvider>
    </QueryClientProvider>
  )
}
