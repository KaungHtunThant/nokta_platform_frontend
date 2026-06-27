// Canonical field view-model + normalizer for the render engine. A FieldVm is the schema's
// FieldDto reduced to exactly what the renderer's field components need — independent of any
// surface. Pure functions -> unit-testable without a DOM. Shared by form, detail, and list.
import type { FieldDto } from '~/types/schema'

export interface FieldOptionVm {
  key: string
  label: string
}

export interface FieldVm {
  key: string
  type: string
  label: string
  required: boolean
  help: string | null
  placeholder: string
  options: FieldOptionVm[]
}

/**
 * Resolve a field's selectable options from persisted `field_options` (preferred) or inline
 * `ui.options`, collapsing localized labels to a display string.
 */
export function resolveFieldOptions(field: FieldDto): FieldOptionVm[] {
  const uiOptions = Array.isArray(field.ui?.options)
    ? (field.ui.options as { key: string, label: Record<string, string> | string }[])
    : []

  return (field.options && field.options.length > 0)
    ? field.options.map(o => ({ key: o.key, label: o.label }))
    : uiOptions.map(o => ({ key: o.key, label: typeof o.label === 'string' ? o.label : (o.label.en ?? o.key) }))
}

/** Normalize a schema FieldDto into the renderer's FieldVm. */
export function toFieldVm(field: FieldDto): FieldVm {
  const ui = field.ui as { placeholder?: unknown } | undefined

  return {
    key: field.key,
    type: field.type,
    label: field.label,
    required: Boolean((field.validation as { required?: boolean } | undefined)?.required),
    help: field.help ?? null,
    placeholder: typeof ui?.placeholder === 'string' ? ui.placeholder : '',
    options: resolveFieldOptions(field),
  }
}
