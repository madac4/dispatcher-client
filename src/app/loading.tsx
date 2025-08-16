import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full bg-white">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  )
}
