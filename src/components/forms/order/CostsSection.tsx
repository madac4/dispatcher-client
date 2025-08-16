'use client'

import { FormSection } from '@/components/forms/common/FormSection'
import { Table, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calculator } from 'lucide-react'

export function CostsSection() {
  return (
    <FormSection title="Approximate Costs" icon={Calculator}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">State</TableHead>
            <TableHead className="text-right font-semibold">Oversize</TableHead>
            <TableHead className="text-right font-semibold">Overweight</TableHead>
            <TableHead className="text-right font-semibold">Superload</TableHead>
            <TableHead className="text-right font-semibold">Service Fee</TableHead>
            <TableHead className="text-right font-semibold">Escort</TableHead>
            <TableHead className="text-right font-semibold">Distance</TableHead>
            <TableHead className="text-right font-semibold">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableFooter>
          <TableRow className="bg-orange-50 font-semibold text-right">
            <TableCell className="text-left">Totals</TableCell>
            <TableCell>$0</TableCell>
            <TableCell>$0</TableCell>
            <TableCell>??</TableCell>
            <TableCell>$0</TableCell>
            <TableCell>$0</TableCell>
            <TableCell>0 mi</TableCell>
            <TableCell>$0</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </FormSection>
  )
}
