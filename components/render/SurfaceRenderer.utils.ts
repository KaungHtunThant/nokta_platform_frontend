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

/**
 * Whether a node renders, combining three gates (any failing → hidden):
 *  1. `permission.ui` — the node's UI permission (visibility only, never security).
 *  2. per-field `ui_visible` — a bound field hidden for this role via role_field_access.
 *  3. `visible_when` — a conditional on another field's value (needs the surface values).
 *
 * `getValue` is supplied by the host surface's context; surfaces without values (nav) omit it,
 * so `visible_when` is treated as satisfied there.
 */
export function isNodeVisible(node: LayoutNode, getValue?: (key: string) => unknown): boolean {
  const abilities = useAbilityStore()

  const ui = node.permission?.ui
  if (ui && !abilities.canSee(ui)) {
    return false
  }

  const fieldKey = node.binding?.field
  if (fieldKey && !abilities.fieldVisible(fieldKey)) {
    return false
  }

  if (node.visibleWhen && getValue && !evaluateCondition(node.visibleWhen, getValue)) {
    return false
  }

  return true
}

/** Evaluate a `visible_when` condition against the current surface values. Unknown ops → visible. */
export function evaluateCondition(
  cond: { field: string, op: string, value: unknown },
  getValue: (key: string) => unknown,
): boolean {
  const actual = getValue(cond.field)

  switch (cond.op) {
    case 'eq':
      return actual === cond.value
    case 'ne':
      return actual !== cond.value
    case 'in':
      return Array.isArray(cond.value) && cond.value.includes(actual)
    case 'gt':
      return Number(actual) > Number(cond.value)
    case 'lt':
      return Number(actual) < Number(cond.value)
    case 'contains':
      return Array.isArray(actual)
        ? actual.includes(cond.value)
        : String(actual ?? '').includes(String(cond.value))
    default:
      return true
  }
}
