// Builder edit CONTROLLER: applies pure tree mutations (layoutTree) to the draft in the store.
// Views call these; the store stays a pure model and the tree helpers stay pure + tested.
import type { LayoutNode } from '~/types/schema'
import { useBuilderStore } from '~/stores/useBuilderStore'
import { reorderWithin, removeNode, insertNode, updateNode, findNode, type LayoutNodePatch } from './layoutTree'

const CONTAINER_TYPES = ['section', 'row', 'col', 'group', 'tabs', 'card', 'board-column']

function store() {
  const s = useBuilderStore()
  if (!s.root) throw new Error('No layout loaded in the builder.')
  return s
}

export function reorderChild(parentId: string, from: number, to: number): void {
  const s = store()
  s.setRoot(reorderWithin(s.root!, parentId, from, to))
}

export function removeNodeById(id: string): void {
  const s = store()
  s.setRoot(removeNode(s.root!, id))
  if (s.selectedId === id) s.select(null)
}

/** Add a field node bound to `fieldKey`, under the selected container (or the root). */
export function addFieldNode(fieldKey: string): void {
  const s = store()
  const node: LayoutNode = { type: 'field', id: newId(), binding: { field: fieldKey } }
  s.setRoot(insertNode(s.root!, targetContainerId(s.root!, s.selectedId), node))
}

export function updateSelected(patch: LayoutNodePatch): void {
  const s = store()
  if (!s.selectedId) return
  s.setRoot(updateNode(s.root!, s.selectedId, patch))
}

/** The container to drop new nodes into: the selection if it's a container, else the root. */
function targetContainerId(root: LayoutNode, selectedId: string | null): string {
  if (selectedId) {
    const selected = findNode(root, selectedId)
    if (selected && CONTAINER_TYPES.includes(selected.type)) return selected.id
  }
  return root.id
}

function newId(): string {
  return 'n-' + Math.random().toString(36).slice(2, 9)
}
