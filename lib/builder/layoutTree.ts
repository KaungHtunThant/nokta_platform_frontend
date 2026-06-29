// Pure, immutable operations on a layout node tree (the builder's editing model). Every function
// returns a NEW tree, leaving the input untouched — so the store can swap trees and Vue reactivity +
// undo stay simple. No Vue, no API → fully unit-testable.
import type { LayoutNode } from '~/types/schema'

// A patch may clear an optional property by setting it to `undefined` (e.g. removing a node's
// binding), so values are explicitly nullable here despite exactOptionalPropertyTypes.
export type LayoutNodePatch = { [K in keyof LayoutNode]?: LayoutNode[K] | undefined }

// Layout nodes are pure JSON (no functions/dates), so a JSON round-trip is a safe deep clone — and
// unlike structuredClone it transparently unwraps Vue reactive proxies and drops `undefined` keys.
export function cloneTree(node: LayoutNode): LayoutNode {
  return JSON.parse(JSON.stringify(node)) as LayoutNode
}

export function findNode(root: LayoutNode, id: string): LayoutNode | undefined {
  if (root.id === id) return root
  for (const child of root.children ?? []) {
    const found = findNode(child, id)
    if (found) return found
  }
  return undefined
}

export function parentOf(root: LayoutNode, id: string): LayoutNode | undefined {
  for (const child of root.children ?? []) {
    if (child.id === id) return root
    const found = parentOf(child, id)
    if (found) return found
  }
  return undefined
}

/** Merge a shallow patch (props/binding/permission/visibleWhen/type) onto the node with `id`. */
export function updateNode(root: LayoutNode, id: string, patch: LayoutNodePatch): LayoutNode {
  const next = cloneTree(root)
  const target = findNode(next, id)
  if (target) Object.assign(target, patch)
  return next
}

/** Remove the node with `id` (the root itself is never removable). */
export function removeNode(root: LayoutNode, id: string): LayoutNode {
  const next = cloneTree(root)
  const strip = (node: LayoutNode): void => {
    if (!node.children) return
    node.children = node.children.filter(c => c.id !== id)
    node.children.forEach(strip)
  }
  strip(next)
  return next
}

/** Insert `node` under `parentId` at `index` (defaults to the end). */
export function insertNode(root: LayoutNode, parentId: string, node: LayoutNode, index?: number): LayoutNode {
  const next = cloneTree(root)
  const parent = findNode(next, parentId)
  if (parent) {
    parent.children = parent.children ?? []
    const at = index ?? parent.children.length
    parent.children.splice(at, 0, node)
  }
  return next
}

/** Reorder a child within its parent (used by drag-to-reorder within a container). */
export function reorderWithin(root: LayoutNode, parentId: string, from: number, to: number): LayoutNode {
  const next = cloneTree(root)
  const parent = findNode(next, parentId)
  const children = parent?.children
  if (children && from >= 0 && to >= 0 && from < children.length && to < children.length) {
    const [moved] = children.splice(from, 1)
    children.splice(to, 0, moved!)
  }
  return next
}

/** Move a node to a new parent at an index (detach + reattach). */
export function moveNode(root: LayoutNode, id: string, toParentId: string, index?: number): LayoutNode {
  const node = findNode(root, id)
  if (!node) return root
  const detached = cloneTree(node)
  return insertNode(removeNode(root, id), toParentId, detached, index)
}
