'use client'

import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

type RangeDatePickerProps = {
  label?: string
  required?: boolean
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  onChange: (date: Date) => void
}

export function RangeDatePicker({ label, required, placeholder, minDate, onChange }: RangeDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [value, setValue] = React.useState(formatDate(date))
  const [open, setOpen] = React.useState(false)

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value)

    setDate(date)
    setValue(formatDate(date))
    setOpen(false)
    onChange(date)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
    }
  }

  const selectDate = (date: Date | undefined) => {
    setDate(date)
    setValue(formatDate(date))
    setOpen(false)
    if (date) onChange(date)
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor="date" className="px-1">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder={placeholder || 'Select a date'}
          className="bg-background pr-10"
          onChange={handleDateChange}
          onKeyDown={handleKeyDown}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id="date-picker" variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              disabled={{ before: minDate as Date }}
              onSelect={date => selectDate(date)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
