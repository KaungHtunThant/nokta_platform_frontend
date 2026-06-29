// CONTROLLER helper for the inspector: assemble a `visible_when` clause (or clear it).
export function buildVisibleWhen(field: string, op: string, value: string): { field: string, op: string, value: unknown } | undefined {
  const trimmed = field.trim()
  if (!trimmed) return undefined
  return { field: trimmed, op: op || 'eq', value }
}
