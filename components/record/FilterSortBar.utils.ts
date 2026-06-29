// CONTROLLER for FilterSortBar: pure logic to pick a default operator per field type and assemble a
// RecordQuery from the bar's local values. Kept out of the .vue View.
import type { FieldDto } from '~/types/schema'
import { setFilter, type RecordQuery } from '~/lib/records/recordQuery'

/** The operator a simple single-value control implies for a given field type. */
export function defaultOpFor(type: string): string {
  switch (type) {
    case 'number':
    case 'decimal':
    case 'money':
      return 'gte'
    case 'bool':
    case 'checkbox':
    case 'select':
    case 'radio':
    case 'date':
    case 'datetime':
      return 'eq'
    default:
      return 'contains'
  }
}

/** Build a RecordQuery from the bar's field values + chosen sort. Empty values drop their clause. */
export function buildQuery(
  values: Record<string, unknown>,
  filterable: FieldDto[],
  sort: string | null,
  dir: 'asc' | 'desc',
): RecordQuery {
  let query: RecordQuery = { filters: [], sort, dir }
  for (const field of filterable) {
    query = setFilter(query, field.key, defaultOpFor(field.type), values[field.key])
  }
  return query
}
