// Unit test for the config-driven render-plan engine (pure logic, no DOM).
import { describe, it, expect } from 'vitest'
import { buildFormFields } from './RecordForm.model'
import type { EntitySchemaDto, LayoutNode } from '~/types/schema'

const schema: EntitySchemaDto = {
  key: 'deal',
  label: 'Deal',
  icon: null,
  supports_pipeline: true,
  fields: [
    { key: 'title', type: 'text', label: 'Title', validation: { required: true }, ui: {}, default_value: null, position: 0 },
    { key: 'priority', type: 'select', label: 'Priority', validation: {}, default_value: null, position: 1,
      ui: { options: [{ key: 'low', label: { en: 'Low' } }, { key: 'high', label: { en: 'High' } }] } },
  ],
}

const layout: LayoutNode = {
  type: 'section', id: 'root',
  children: [
    { type: 'field', id: 'f-title', binding: { field: 'title' } },
    { type: 'field', id: 'f-priority', binding: { field: 'priority' } },
    { type: 'field', id: 'f-ghost', binding: { field: 'does_not_exist' } }, // must be skipped
  ],
}

describe('buildFormFields', () => {
  it('resolves layout field nodes against the schema, in order', () => {
    const vms = buildFormFields(schema, layout)
    expect(vms.map(v => v.key)).toEqual(['title', 'priority'])
  })

  it('marks required fields and resolves select options', () => {
    const vms = buildFormFields(schema, layout)
    expect(vms[0]).toMatchObject({ key: 'title', type: 'text', required: true })
    expect(vms[1]!.options).toEqual([{ key: 'low', label: 'Low' }, { key: 'high', label: 'High' }])
  })

  it('tolerates layout nodes that reference missing fields (drops them)', () => {
    const vms = buildFormFields(schema, layout)
    expect(vms.find(v => v.key === 'does_not_exist')).toBeUndefined()
  })
})
