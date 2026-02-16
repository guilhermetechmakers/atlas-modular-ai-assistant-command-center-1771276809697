import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: React.ReactNode
  /** Content for the dialog body (default: description only) */
  body?: React.ReactNode
  /** Cancel button label */
  cancelLabel?: string
  /** Action button label (e.g. "Delete") */
  actionLabel?: string
  /** Action button variant */
  actionVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Called when action is clicked; dialog closes after if not prevented */
  onAction?: () => void | Promise<void>
  /** When true, action button shows loading and is disabled */
  actionLoading?: boolean
  /** When set, action button submits this form by id (form="...") instead of calling onAction */
  formId?: string
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  body,
  cancelLabel = 'Cancel',
  actionLabel,
  actionVariant = 'destructive',
  onAction,
  actionLoading = false,
  formId,
}: AlertDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const isBusy = actionLoading ?? loading
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onOpenChange])

  React.useEffect(() => {
    if (open && cancelRef.current) {
      cancelRef.current.focus()
    }
  }, [open])

  const handleAction = async () => {
    if (formId) return
    if (!onAction) {
      onOpenChange(false)
      return
    }
    setLoading(true)
    try {
      await onAction()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-desc"
    >
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={() => !isBusy && onOpenChange(false)}
        aria-hidden
      />
      <div
        className={cn(
          'relative z-50 w-full max-w-lg rounded-card-lg border border-border bg-card p-6 shadow-card',
          'animate-fade-in-up'
        )}
      >
        <h2 id="alert-dialog-title" className="text-title font-semibold text-foreground">
          {title}
        </h2>
        {(description || body) && (
          <div id="alert-dialog-desc" className="mt-2 text-body text-muted-foreground">
            {body ?? description}
          </div>
        )}
        {children}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button
            ref={cancelRef}
            variant="outline"
            onClick={() => !isBusy && onOpenChange(false)}
            disabled={isBusy}
          >
            {cancelLabel}
          </Button>
          {actionLabel && (
            <Button
              type={formId ? 'submit' : 'button'}
              form={formId}
              variant={actionVariant}
              onClick={formId ? undefined : handleAction}
              disabled={isBusy}
              isLoading={isBusy}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
