// View registry — maps a nav entry's `viewType` to the page component that renders it. The catch-all
// route resolves a slug to a nav entry, then mounts the matching view. Extensible (OCP): register a
// new viewType here without touching the router. Record-scoped surfaces (detail/form) stay as
// concrete file routes; nav entries point at collection views.
import type { Component } from 'vue'

const registry = new Map<string, Component>()

export function registerViewType(viewType: string, component: Component): void {
  registry.set(viewType, component)
}

export function resolveViewType(viewType: string): Component | undefined {
  return registry.get(viewType)
}
