// Field-type registry — maps a field definition's `type` to its input/display components.
// Extensible at runtime (OCP): register new field types without editing a switch.
import type { Component } from 'vue'

export interface FieldTypeEntry {
  display: Component
  input: Component
}

const registry = new Map<string, FieldTypeEntry>()

export function registerFieldType(type: string, entry: FieldTypeEntry): void {
  registry.set(type, entry)
}

export function resolveFieldType(type: string): FieldTypeEntry | undefined {
  return registry.get(type)
}

// Register built-ins (text, number, select, date, bool, …) in a Nuxt plugin during Phase 1.
