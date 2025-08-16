'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LucideIcon } from 'lucide-react'

interface TabItem {
  value: string
  label: string
  icon?: LucideIcon
  content: React.ReactNode
}

interface PageTabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
  tabsListClassName?: string
}

export function PageTabs({ tabs, activeTab, onTabChange, className, tabsListClassName }: PageTabsProps) {
  return (
    <Tabs value={activeTab} defaultValue={tabs[0].value} onValueChange={onTabChange} className={className}>
      <TabsList className={tabsListClassName || 'grid w-full grid-cols-4 h-10 bg-gray-100 p-1 rounded-lg'}>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent value={tab.value} key={tab.value} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
