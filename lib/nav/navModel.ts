// Nav MODEL: flattens a `nav` layout tree into typed nav entries and resolves a slug → entry.
// Pure (no Vue/router/store) so the catch-all resolver and the menu both reuse it and it unit-tests.
import type { LayoutNode } from '~/types/schema'
import { localizeLabel } from '~/lib/render/localize'

export interface NavEntry {
  slug: string
  label: string
  icon: string | null
  viewType: string
  entityType: string
  pipeline: string | null
  layoutKey: string | null
  ui: string | null // required ui permission, if any
}

/** Depth-first list of every `nav-item` node in the tree. */
export function navEntries(nav: LayoutNode | null | undefined): NavEntry[] {
  if (!nav) return []

  return flatten(nav)
    .filter(node => node.type === 'nav-item')
    .map(toEntry)
}

export function resolveNavEntry(nav: LayoutNode | null | undefined, slug: string): NavEntry | undefined {
  return navEntries(nav).find(entry => entry.slug === slug)
}

function flatten(node: LayoutNode): LayoutNode[] {
  return [node, ...(node.children ?? []).flatMap(flatten)]
}

function toEntry(node: LayoutNode): NavEntry {
  const p = node.props ?? {}

  return {
    slug: String(p.slug ?? ''),
    label: localizeLabel(p.label),
    icon: typeof p.icon === 'string' ? p.icon : null,
    viewType: String(p.viewType ?? 'list'),
    entityType: String(p.entityType ?? ''),
    pipeline: typeof p.pipeline === 'string' ? p.pipeline : null,
    layoutKey: typeof p.layoutKey === 'string' ? p.layoutKey : null,
    ui: node.permission?.ui ?? null,
  }
}
