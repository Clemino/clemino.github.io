"use client"

import { useEffect, useMemo } from "react"
import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVerticalIcon } from "lucide-react"
import { shuffled } from "@/lib/shuffle"
import { cn } from "@/lib/utils"

type Item = { id: string; label: string }

export function OrderingList({
  payload,
  order,
  onChange,
  disabled,
}: {
  payload: { items: Item[] }
  order: string[] | null
  onChange: (v: string[]) => void
  disabled: boolean
}) {
  // Initialize order if null
  useEffect(() => {
    if (!order) {
      onChange(shuffled(payload.items).map((i) => i.id))
    }
  }, [order, payload.items, onChange])

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))

  const current = order ?? payload.items.map((i) => i.id)
  const itemsById = useMemo(() => new Map(payload.items.map((i) => [i.id, i])), [payload.items])

  const handleDragEnd = (e: DragEndEvent) => {
    if (disabled) return
    if (!e.over || e.active.id === e.over.id) return
    const oldIndex = current.indexOf(e.active.id as string)
    const newIndex = current.indexOf(e.over.id as string)
    onChange(arrayMove(current, oldIndex, newIndex))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={current} strategy={verticalListSortingStrategy}>
        <ol className="space-y-2">
          {current.map((id, i) => {
            const item = itemsById.get(id)
            if (!item) return null
            return <SortableRow key={id} id={id} index={i} label={item.label} disabled={disabled} />
          })}
        </ol>
      </SortableContext>
    </DndContext>
  )
}

function SortableRow({ id, index, label, disabled }: { id: string; index: number; label: string; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-1)] px-4 py-3 text-sm transition-colors",
        isDragging && "border-[var(--accent)] bg-[var(--bg-2)]",
        disabled && "cursor-not-allowed opacity-80",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        aria-label="Réordonner"
        className="cursor-grab rounded-sm p-0.5 text-[var(--fg-3)] hover:text-[var(--fg-1)] active:cursor-grabbing"
      >
        <GripVerticalIcon className="size-4" />
      </button>
      <span className="font-mono text-xs tabular-nums text-[var(--fg-3)]">{String(index + 1).padStart(2, "0")}</span>
      <span className="flex-1 font-mono text-[13px] text-[var(--fg-0)]">{label}</span>
    </li>
  )
}
