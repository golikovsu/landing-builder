import { notFound } from 'next/navigation'
import Script from 'next/script'
import type { Metadata } from 'next'
import type { Block } from '../../../lib/api'
import { renderBlock } from '../../../components/blocks/render'

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'

interface Landing {
  id: string
  title: string
  slug: string
  blocks: Block[]
  seoTitle?: string | null
  seoDescription?: string | null
  seoImage?: string | null
  canonicalUrl?: string | null
}

async function getLandingBySlug(slug: string): Promise<Landing | null> {
  try {
    const res = await fetch(`${API_URL}/p/${slug}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    })
    if (!res.ok) return null
    const json = (await res.json()) as { data: Landing }
    return json.data
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const landing = await getLandingBySlug(slug)
  if (!landing) return {}

  const title = landing.seoTitle || landing.title
  const description = landing.seoDescription || undefined

  return {
    title,
    description,
    ...(landing.canonicalUrl && {
      alternates: { canonical: landing.canonicalUrl },
    }),
    openGraph: {
      title,
      description,
      ...(landing.seoImage && {
        images: [{ url: landing.seoImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(landing.seoImage && { images: [landing.seoImage] }),
    },
  }
}

export default async function PublicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const landing = await getLandingBySlug(slug)

  if (!landing) notFound()

  const sortedBlocks = [...landing.blocks].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-bg-base text-white">
      {sortedBlocks.map(block => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}

      {/* Attribution tracking — same-origin proxy → iqbroker.com */}
      <Script src="/lp/attribute/js/client.js" strategy="afterInteractive" />
    </div>
  )
}
