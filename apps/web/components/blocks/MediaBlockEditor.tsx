'use client'

import { useRef } from 'react'
import type { Block } from '../../lib/api'
import { mediaApi } from '../../lib/api'

interface MediaItem {
  url: string
  caption?: string
  type: 'image' | 'video'
}

interface MediaContent {
  heading: string
  items: MediaItem[]
  layout: 'grid' | 'carousel' | 'single'
}

interface Props {
  block: Block
  isSelected: boolean
  onChange: (content: Record<string, unknown>) => void
}

export function MediaBlockEditor({ block, isSelected, onChange }: Props) {
  const c = block.content as unknown as MediaContent
  const fileRef = useRef<HTMLInputElement>(null)

  const addItem = (item: MediaItem) => {
    onChange({ ...c, items: [...c.items, item] })
  }

  const removeItem = (index: number) => {
    onChange({ ...c, items: c.items.filter((_, i) => i !== index) })
  }

  const updateItemCaption = (index: number, caption: string) => {
    onChange({
      ...c,
      items: c.items.map((item, i) => (i === index ? { ...item, caption } : item)),
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await mediaApi.upload(file)
      const isVideo = file.type.startsWith('video/')
      addItem({ url: res.data.data.url, type: isVideo ? 'video' : 'image' })
    } catch (err) {
      console.error('Upload failed', err)
    }
  }

  const [urlInput, setUrlInput] = React.useState('')

  const addFromUrl = () => {
    if (!urlInput.trim()) return
    const isVideo = /\.(mp4|webm|ogg)$/i.test(urlInput)
    addItem({ url: urlInput.trim(), type: isVideo ? 'video' : 'image' })
    setUrlInput('')
  }

  return (
    <div className="rounded-xl bg-bg-card px-8 py-12">
      {isSelected ? (
        <input
          type="text"
          value={c.heading}
          onChange={e => onChange({ ...c, heading: e.target.value })}
          className="mb-6 block w-full bg-transparent text-center text-2xl font-bold text-white outline-none focus:underline"
        />
      ) : (
        <h2 className="mb-6 text-center text-2xl font-bold text-white">{c.heading}</h2>
      )}

      {/* Layout picker */}
      {isSelected && (
        <div className="mb-6 flex items-center justify-center gap-2">
          {(['grid', 'carousel', 'single'] as const).map(l => (
            <button
              key={l}
              onClick={() => onChange({ ...c, layout: l })}
              className={`rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                c.layout === l
                  ? 'bg-orange text-white'
                  : 'bg-white/8 text-text-secondary hover:bg-white/12'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Media items */}
      <div
        className={
          c.layout === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'
        }
      >
        {c.items.map((item, i) => (
          <div key={i} className="group relative overflow-hidden rounded-lg">
            {item.type === 'video' ? (
              <video src={item.url} className="w-full rounded-lg" controls />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.caption ?? ''}
                className="w-full rounded-lg object-cover"
              />
            )}
            {isSelected && (
              <>
                <button
                  onClick={() => removeItem(i)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
                <input
                  type="text"
                  value={item.caption ?? ''}
                  onChange={e => updateItemCaption(i, e.target.value)}
                  placeholder="Caption..."
                  className="mt-1 block w-full bg-transparent text-xs text-text-secondary outline-none focus:underline"
                />
              </>
            )}
            {!isSelected && item.caption && (
              <p className="mt-1 text-xs text-text-secondary">{item.caption}</p>
            )}
          </div>
        ))}

        {isSelected && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-white/16 p-6 text-text-muted">
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-lg bg-white/8 px-4 py-2 text-sm text-white transition-colors hover:bg-white/12"
            >
              Upload file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <span className="text-xs">or</span>
            <div className="flex w-full gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="Paste URL..."
                className="flex-1 rounded bg-white/8 px-3 py-1.5 text-xs text-white outline-none focus:bg-white/12"
                onKeyDown={e => e.key === 'Enter' && addFromUrl()}
              />
              <button
                onClick={addFromUrl}
                className="rounded bg-orange px-3 py-1.5 text-xs text-white hover:bg-orange-alt"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Need React import for useState
import React from 'react'
