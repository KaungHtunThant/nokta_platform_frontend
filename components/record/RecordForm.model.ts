// MODEL (type + builder) for the RecordForm use-case.
// buildFormFields() is the heart of the config-driven engine: it walks a layout tree, resolves
// each field node against the entity schema, and produces an ordered list of view-models the
// View renders generically. Pure function -> fully unit-testable (no DOM).
import type { EntitySchemaDto, FieldDto, LayoutNode } from '~/types/schema'

export interface FormFieldVm {
  key: string
  type: string
  label: string
  required: boolean
  options: { key: string, label: string }[]
}

function toVm(field: FieldDto): FormFieldVm {
  const uiOptions = Array.isArray(field.ui?.options)
    ? (field.ui.options as { key: string, label: Record<string, string> | string }[])
    : []

  const options = (field.options && field.options.length > 0)
    ? field.options.map(o => ({ key: o.key, label: o.label }))
    : uiOptions.map(o => ({ key: o.key, label: typeof o.label === 'string' ? o.label : (o.label.en ?? o.key) }))

  return {
    key: field.key,
    type: field.type,
    label: field.label,
    required: Boolean((field.validation as { required?: boolean })?.required),
    options,
  }
}

/** Flatten a layout tree into the ordered field view-models present in the schema. */
export function buildFormFields(schema: EntitySchemaDto, node: LayoutNode): FormFieldVm[] {
  const byKey = new Map(schema.fields.map(f => [f.key, f]))
  const out: FormFieldVm[] = []

  const walk = (n: LayoutNode): void => {
    if (n.type === 'field' && n.binding?.field) {
      const field = byKey.get(n.binding.field)
      if (field) out.push(toVm(field)) // tolerate missing fields: skip, never crash
    }
    for (const child of n.children ?? []) walk(child)
  }

  walk(node)
  return out
}
