// components/ActionsMenu.tsx
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDialogStore } from '@/lib/store'
import { MoreHorizontal } from 'lucide-react'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'
import Link from 'next/link'
import { useState } from 'react'

export type TableAction<T> = {
  label: string | ((element: T) => string)
  icon?: IconName
  className?: string
  dialogContent?: (element: T) => React.ReactNode
  isHidden?: (element: T) => boolean
  isDisabled?: (element: T) => boolean
  link?: (element: T) => string
  isUpload?: boolean
  action: (element: T) => void
}

interface ActionsMenuProps<T> {
  item: T
  actions: TableAction<T>[]
}

export function ActionsMenu<T>({ item, actions }: ActionsMenuProps<T>) {
  const getLabel = (action: TableAction<T>) => (typeof action.label === 'function' ? action.label(item) : action.label)
  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { setIsDialogOpen, isDialogOpen } = useDialogStore()

  const handleOpenDialog = (index: number) => {
    setOpenDialogIndex(index)
    setDropdownOpen(false)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setOpenDialogIndex(null)
    setIsDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map((action, index) => {
            if (action.isHidden?.(item)) return null
            const isDisabled = action.isDisabled?.(item) ?? false

            const content = (
              <>
                {action.icon && <DynamicIcon name={action.icon} className="h-4 w-4" />}
                {getLabel(action)}
              </>
            )

            if (action.dialogContent) {
              return (
                <DropdownMenuItem
                  key={index}
                  disabled={isDisabled}
                  className={action.className}
                  onClick={() => handleOpenDialog(index)}
                >
                  {content}
                </DropdownMenuItem>
              )
            }

            if (action.link) {
              return (
                <DropdownMenuItem key={index} asChild disabled={isDisabled}>
                  <Link href={action.link(item)} className={action.className}>
                    {content}
                  </Link>
                </DropdownMenuItem>
              )
            }

            return (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  action.action(item)
                  setDropdownOpen(false)
                }}
                className={action.className}
                disabled={isDisabled}
              >
                {content}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {actions.map(
        (action, index) =>
          action.dialogContent && (
            <Dialog
              key={index}
              open={openDialogIndex === index && isDialogOpen}
              onOpenChange={open => {
                if (!open) handleCloseDialog()
              }}
            >
              {action.dialogContent(item)}
            </Dialog>
          ),
      )}
    </>
  )
}
