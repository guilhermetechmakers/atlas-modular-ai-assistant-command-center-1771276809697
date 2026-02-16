import { Wallet, Upload, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function FinancePage() {
  const isLoading = false

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display font-bold text-foreground">Finance Cockpit</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Transactions ledger, invoices, budget & runway, AI finance tools.
          </p>
        </div>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title">Ledger</CardTitle>
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-16 w-full" /> : (
              <p className="text-body text-muted-foreground">Transactions and CSV import.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">Invoices panel.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-title">Budget & runway</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-16 w-full" /> : (
              <p className="text-body text-muted-foreground">Charts and AI summary.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardContent className="pt-0">
            <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
              <Wallet className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">Import a CSV to populate the ledger.</p>
              <Button variant="outline" className="mt-4">Import CSV</Button>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
