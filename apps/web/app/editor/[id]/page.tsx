'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useEditorStore } from '../../../stores/editor.store'
import { landingsApi } from '../../../lib/api'
import { EditorToolbar } from '../../../components/editor/EditorToolbar'
import { BlockLibrary } from '../../../components/editor/BlockLibrary'
import { EditorCanvas } from '../../../components/editor/EditorCanvas'
import { SettingsPanel } from '../../../components/editor/SettingsPanel'

export default function EditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { init, landing } = useEditorStore()

  useEffect(() => {
    if (!params.id) return

    landingsApi
      .get(params.id)
      .then(res => init(res.data.data))
      .catch(() => router.push('/dashboard'))
  }, [params.id, init, router])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { undo, redo, save } = useEditorStore.getState()
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        void save()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!landing) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
          <p className="text-sm text-text-secondary">Loading editor…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-base text-white">
      <EditorToolbar />

      <div className="flex flex-1 overflow-hidden">
        <BlockLibrary />
        <EditorCanvas />
        <SettingsPanel />
      </div>
    </div>
  )
}
