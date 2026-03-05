'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEditorStore } from '../../stores/editor.store'
import { BlockWrapper } from './BlockWrapper'

export function EditorCanvas() {
  const { blocks, reorderBlocks, selectBlock } = useEditorStore()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex(b => b.id === active.id)
    const newIndex = blocks.findIndex(b => b.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = [...blocks]
    const [moved] = reordered.splice(oldIndex, 1)
    if (!moved) return
    reordered.splice(newIndex, 0, moved)

    void reorderBlocks(reordered.map(b => b.id))
  }

  if (!blocks.length) {
    return (
      <main
        className="flex flex-1 items-center justify-center overflow-y-auto bg-bg-base p-8"
        onClick={() => selectBlock(null)}
      >
        <div className="text-center">
          <div className="mb-4 text-6xl opacity-20">⬛</div>
          <p className="text-lg font-medium text-text-secondary">Canvas is empty</p>
          <p className="mt-1 text-sm text-text-muted">Click a block in the library to add it</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto bg-bg-base p-8" onClick={() => selectBlock(null)}>
      <div className="mx-auto max-w-4xl">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4 pt-8">
              {blocks.map(block => (
                <BlockWrapper key={block.id} block={block} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </main>
  )
}
