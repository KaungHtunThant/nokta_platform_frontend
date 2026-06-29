// Record query MODEL: the filter DSL + sort the list/board surfaces send to the API. Pure functions
// (build query params, toggle clauses) so the UI stays declarative and this is unit-testable.

export interface FilterClause {
  field: string
  op: string
  value: unknown
}

export interface RecordQuery {
  filters: FilterClause[]
  sort: string | null
  dir: 'asc' | 'desc'
}

export function emptyQuery(): RecordQuery {
  return { filters: [], sort: null, dir: 'asc' }
}

/** Serialise a query to the API's params: `filters` (JSON), `sort`, `dir`. Omits empty pieces. */
export function toQueryParams(query: RecordQuery): Record<string, string> {
  const params: Record<string, string> = {}

  const active = query.filters.filter(f => f.value !== '' && f.value !== null && f.value !== undefined)
  if (active.length > 0) {
    params.filters = JSON.stringify(active)
  }

  if (query.sort) {
    params.sort = query.sort
    params.dir = query.dir
  }

  return params
}

/** Replace (or clear) the clause for a field — keeps at most one clause per field. */
export function setFilter(query: RecordQuery, field: string, op: string, value: unknown): RecordQuery {
  const filters = query.filters.filter(f => f.field !== field)
  if (value !== '' && value !== null && value !== undefined) {
    filters.push({ field, op, value })
  }
  return { ...query, filters }
}
