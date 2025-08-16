'use client'

import { pageSizeOptions } from '@/constants/constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type PaginationProps = {
  itemsPerPage: number
  currentPage: number
  totalPages: number
  totalItems: number
  itemsLength: number
  onPaginationChange: (pageSize: number, page: number) => void
}

export function Pagination({ itemsPerPage, currentPage, totalPages, totalItems, onPaginationChange }: PaginationProps) {
  const getPages = () => {
    const maxPagesToShow = 2
    const pages: (number | string)[] = []
    const ellipsis = '...'

    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    pages.push(1)

    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPagesToShow / 2))

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1)
      } else {
        startPage = Math.max(2, endPage - maxPagesToShow + 1)
      }
    }

    if (startPage > 2) pages.push(ellipsis)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages - 1) pages.push(ellipsis)

    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const goToPage = (page: number) => {
    onPaginationChange(itemsPerPage, page)
  }

  return (
    totalItems > itemsPerPage && (
      <div className="flex items-center mt-2 sm:mt-0 justify-between">
        <Select value={itemsPerPage.toString()} onValueChange={value => onPaginationChange(Number(value), 1)}>
          <SelectTrigger>
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map(size => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <nav className="flex flex-row items-center gap-1">
          <Button
            variant="secondary"
            size="icon-sm"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </Button>

          {getPages().map(page => (
            <Button
              key={page}
              variant={currentPage === page ? 'outline' : 'ghost'}
              size="icon-sm"
              onClick={() => goToPage(Number(page))}
              disabled={currentPage === page}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="secondary"
            size="icon-sm"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </nav>
      </div>
    )
  )
}
