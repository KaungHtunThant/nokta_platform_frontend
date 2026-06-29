import { describe, it, expect } from 'vitest'
import { defaultOpFor, buildQuery } from './FilterSortBar.utils'
import type { FieldDto } from '~/types/schema'

function field(key: string, type: string): FieldDto {
  return { key, type, label: key, validation: {}, ui: {}, default_value: null, position: 0 }
}

describe('FilterSortBar.utils', () => {
  it('chooses an operator suited to the field type', () => {
    expect(defaultOpFor('money')).toBe('gte')
    expect(defaultOpFor('text')).toBe('contains')
    expect(defaultOpFor('select')).toBe('eq')
  })

  it('builds a query from active values, dropping empties, and carries sort', () => {
    const filterable = [field('budget', 'money'), field('name', 'text')]
    const q = buildQuery({ budget: 200, name: '' }, filterable, 'budget', 'desc')

    expect(q.filters).toEqual([{ field: 'budget', op: 'gte', value: 200 }])
    expect(q.sort).toBe('budget')
    expect(q.dir).toBe('desc')
  })
})
