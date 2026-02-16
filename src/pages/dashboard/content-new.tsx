import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  body: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function ContentNewPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: FormData) => {
    // TODO: create draft API
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-display font-bold text-foreground">Add content</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Quick capture for ideas or drafts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New idea or draft</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Content title"
                {...register('title')}
                className={cn(errors.title && 'border-destructive')}
              />
              {errors.title && (
                <p className="text-caption text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body (optional)</Label>
              <textarea
                id="body"
                className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-body placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Notes or draft…"
                {...register('body')}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" isLoading={isSubmitting}>Save</Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/dashboard/content">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
