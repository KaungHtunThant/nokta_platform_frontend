// Read-only value formatting for the detail surface, by field type. Pure -> unit-testable.
// (Display components delegate here; this is the OCP seam where new types add formatting.)
import type { FieldVm } from './fieldVm'

const EMPTY = '—'

export function formatFieldValue(field: FieldVm, value: unknown): string {
  if (value === null || value === undefined || value === '') return EMPTY

  const labelFor = (v: unknown): string => field.options.find(o => o.key === String(v))?.label ?? String(v)

  switch (field.type) {
    case 'bool':
    case 'checkbox':
      return value ? 'Yes' : 'No'
    case 'select':
    case 'radio':
      return labelFor(value)
    case 'multiselect': {
      const arr = Array.isArray(value) ? value : [value]
      return arr.length > 0 ? arr.map(labelFor).join(', ') : EMPTY
    }
    case 'number':
    case 'money':
    case 'decimal': {
      const n = Number(value)
      return Number.isFinite(n) ? n.toLocaleString() : String(value)
    }
    default:
      return String(value)
  }
}
