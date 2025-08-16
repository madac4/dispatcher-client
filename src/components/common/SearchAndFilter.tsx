'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, RefreshCw, Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface FilterOption {
  value: string
  label: string
  quantity?: number
}

interface SearchAndFilterProps {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  filterOptions?: FilterOption[]
  filterValue: string
  onFilterChange: (value: string) => void
  onClearFilters: () => void
  onRefresh?: () => void
  searchDelay?: number
  className?: string
}

export function SearchAndFilter({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filterOptions = [],
  filterValue,
  onFilterChange,
  onClearFilters,
  onRefresh,
  searchDelay = 300,
  className,
}: SearchAndFilterProps) {
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [localSearchValue, setLocalSearchValue] = useState(searchValue)

  useEffect(() => {
    setLocalSearchValue(searchValue)
  }, [searchValue])

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearchValue(value)

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      searchTimeoutRef.current = setTimeout(() => {
        onSearchChange(value)
      }, searchDelay)
    },
    [onSearchChange, searchDelay],
  )

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-orange-500" />
            Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClearFilters}>
              Clear all
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={searchPlaceholder}
                value={localSearchValue}
                onChange={e => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filterOptions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={filterValue} onValueChange={onFilterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} {option.quantity !== undefined && `(${option.quantity})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
