import Link from 'next/link'

export function Logo({ url = '/' }: { url?: string }) {
  return (
    <Link href={url} className="flex items-center gap-2">
      <div className="bg-primary text-white p-1 rounded text-xs">
        <h4 className="font-semibold">OSOW</h4>
        EXPRESS
      </div>
    </Link>
  )
}
