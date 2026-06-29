import { describe, it, expect } from 'vitest'
import { emptyQuery, toQueryParams, setFilter } from './recordQuery'

describe('recordQuery', () => {
  it('omits filters/sort when empty', () => {
    expect(toQueryParams(emptyQuery())).toEqual({})
  })

  it('serialises active filters as JSON and includes sort + dir', () => {
    const q = { filters: [{ field: 'budget', op: 'gte', value: 200 }], sort: 'budget', dir: 'desc' as const }
    const params = toQueryParams(q)
    expect(JSON.parse(params.filters!)).toEqual([{ field: 'budget', op: 'gte', value: 200 }])
    expect(params.sort).toBe('budget')
    expect(params.dir).toBe('desc')
  })

  it('drops empty-valued filter clauses', () => {
    const q = { filters: [{ field: 'budget', op: 'gte', value: '' }], sort: null, dir: 'asc' as const }
    expect(toQueryParams(q).filters).toBeUndefined()
  })

  it('setFilter keeps at most one clause per field and clears on empty value', () => {
    let q = emptyQuery()
    q = setFilter(q, 'budget', 'gte', 100)
    q = setFilter(q, 'budget', 'gte', 200) // replaces
    expect(q.filters).toEqual([{ field: 'budget', op: 'gte', value: 200 }])

    q = setFilter(q, 'budget', 'gte', '') // clears
    expect(q.filters).toEqual([])
  })
})
