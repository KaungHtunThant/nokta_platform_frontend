// CONTROLLER helper for BuilderOutline: a readable label for a node row.
import type { LayoutNode } from '~/types/schema'

export function nodeLabel(node: LayoutNode): string {
  if (node.binding?.field) return `${node.type} · ${node.binding.field}`
  return node.type
}
