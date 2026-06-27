// Component registry — maps a layout node `type` (row, col, tabs, section, field, widget,
// nav-item, board-column, card-slot) to the Vue component that renders it.
// Drives the generic SurfaceRenderer. Extensible at runtime (custom widgets).
import type { Component } from 'vue'

const registry = new Map<string, Component>()

export function registerNodeType(type: string, component: Component): void {
  registry.set(type, component)
}

export function resolveNodeType(type: string): Component | undefined {
  return registry.get(type)
}
