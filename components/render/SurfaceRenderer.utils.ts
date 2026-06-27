// CONTROLLER for SurfaceRenderer: rendering logic kept out of the .vue View.
import type { Component } from 'vue'
import { resolveNodeType } from '~/lib/registries/componentRegistry'
import { useAbilityStore } from '~/stores/useAbilityStore'

export interface LayoutNode {
  type: string
  id: string
  props?: Record<string, unknown>
  binding?: { field: string }
  permission?: { ui?: string }
  visibleWhen?: { field: string, op: string, value: unknown }
  children?: LayoutNode[]
}

/** Resolve the component for a node; tolerate unknown types (drop, never crash). */
export function resolveNode(node: LayoutNode): Component | string {
  return resolveNodeType(node.type) ?? 'div'
}

/** Gate a node on its UI permission (visibility only — never security). */
export function isNodeVisible(node: LayoutNode): boolean {
  const ui = node.permission?.ui
  if (!ui) return true
  return useAbilityStore().canSee(ui)
}
