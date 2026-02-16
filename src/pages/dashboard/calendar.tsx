import { Calendar as CalendarIcon, MapPin, ListTodo } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function CalendarPage() {
  const isLoading = false

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display font-bold text-foreground">Calendar & Travel</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Day/week/month view, tasks, routines, and trip board.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Day</Button>
          <Button variant="outline">Week</Button>
          <Button>Month</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              <div className="rounded-lg border border-border h-64 flex items-center justify-center text-muted-foreground">
                Connect Google Calendar to see events.
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-cyan" />
              Tasks & routines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">Tasks with recurrence and reminders.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple" />
            Trip board
          </CardTitle>
          <CardContent className="pt-0">
            <p className="text-body text-muted-foreground mb-4">Plan trips with the Personal agent; itineraries and packing lists.</p>
            <Button>Plan trip</Button>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
