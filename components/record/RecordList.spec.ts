// Unit test for the entity-generic list row builder (pure logic, no DOM).
import { describe, it, expect } from 'vitest'
import { buildRows } from './RecordList.model'
import type { EntitySchemaDto } from '~/types/schema'
import type { RecordDto } from '~/types/dto'

const schema: EntitySchemaDto = {
  key: 'deal',
  label: 'Deal',
  icon: null,
  supports_pipeline: true,
  fields: [
    { key: 'budget', type: 'money', label: 'Budget', validation: {}, ui: {}, default_value: null, position: 0 },
    { key: 'title', type: 'text', label: 'Title', validation: {}, ui: {}, default_value: null, position: 1 },
  ],
}

function record(id: number, data: Record<string, unknown>, status: string | null = 'open'): RecordDto {
  return { id, entity_type: 'deal', stage_id: null, owner_id: null, status, data, created_at: '', updated_at: '' }
}

describe('buildRows', () => {
  it('labels each row by the schema\'s first text field, not field order', () => {
    const rows = buildRows(schema, [record(1, { title: 'Hip replacement', budget: 1500 })])
    expect(rows[0]).toEqual({ id: 1, title: 'Hip replacement', status: 'open' })
  })

  it('falls back to #id when the primary value is empty, and tolerates null status', () => {
    const rows = buildRows(schema, [record(7, { title: '' }, null)])
    expect(rows[0]).toEqual({ id: 7, title: '#7', status: '' })
  })
})
