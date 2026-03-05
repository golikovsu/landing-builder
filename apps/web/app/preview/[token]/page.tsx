import { notFound } from 'next/navigation'
import type { Block } from '../../../lib/api'
import { renderBlock } from '../../../components/blocks/render'

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'

interface Landing {
  id: string
  title: string
  slug: string
  status: string
  blocks: Block[]
}

async function getLandingByToken(token: string): Promise<Landing | null> {
  try {
    const res = await fetch(`${API_URL}/preview/${token}`, {
      cache: 'no-store', // always fresh — this is a draft preview
    })
    if (!res.ok) return null
    const json = (await res.json()) as { data: Landing }
    return json.data
  } catch {
    return null
  }
}

export default async function PreviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const landing = await getLandingByToken(token)

  if (!landing) notFound()

  const sortedBlocks = [...landing.blocks].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-bg-base text-white">
      {/* Draft banner */}
      <div className="sticky top-0 z-50 flex items-center justify-between bg-orange/90 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          Draft Preview — {landing.title}
        </div>
        <span className="rounded bg-white/20 px-2 py-0.5 text-xs uppercase tracking-wider text-white">
          {landing.status}
        </span>
      </div>

      {sortedBlocks.map(block => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}
    </div>
  )
}
