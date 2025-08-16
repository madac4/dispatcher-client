'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2, LucideIcon } from 'lucide-react'

interface FormActionsProps {
  onSubmit: () => void
  onCancel?: () => void
  submitText?: string
  cancelText?: string
  submitIcon?: LucideIcon
  cancelIcon?: LucideIcon
  isLoading?: boolean
  loadingText?: string
  disabled?: boolean
  className?: string
  variant?: 'default' | 'sticky'
}

export function FormActions({
  onSubmit,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  submitIcon: SubmitIcon,
  cancelIcon: CancelIcon,
  isLoading = false,
  loadingText = 'Submitting...',
  disabled = false,
  className,
  variant = 'default',
}: FormActionsProps) {
  const actions = (
    <div className={cn('flex gap-4 items-center justify-end', className)}>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {CancelIcon && <CancelIcon className="w-4 h-4" />}
          {cancelText}
        </Button>
      )}
      <Button type="submit" onClick={onSubmit} disabled={disabled || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            {SubmitIcon && <SubmitIcon className="w-4 h-4" />}
            {submitText}
          </>
        )}
      </Button>
    </div>
  )

  if (variant === 'sticky') {
    return (
      <div className="sticky -mx-6 bottom-0 left-0 right-0 -mb-6 mt-6 bg-white p-4 border-t border-gray-200">
        {actions}
      </div>
    )
  }

  return actions
}
