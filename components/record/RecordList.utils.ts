// CONTROLLER for the RecordList use-case: fetch schema + records (API), cache the schema,
// and return the row view-models. No logic in the View; no API in the stores.
import type { FieldDto } from '~/types/schema'
import { schemaApi, recordsApi } from '~/lib/api/client'
import { useSchemaStore } from '~/stores/useSchemaStore'
import { toQueryParams, type RecordQuery } from '~/lib/records/recordQuery'
import { buildRows, type RecordRowVm } from './RecordList.model'

export interface RecordListView {
  rows: RecordRowVm[]
  filterable: FieldDto[]
  sortable: FieldDto[]
}

/** Load the entity schema + its (optionally filtered/sorted) records; cache schema; return the view. */
export async function loadList(entityKey: string, query?: RecordQuery): Promise<RecordListView> {
  const [schema, page] = await Promise.all([
    schemaApi.get(entityKey),
    recordsApi.list(entityKey, query ? toQueryParams(query) : {}),
  ])

  useSchemaStore().setSchema(schema)

  return {
    rows: buildRows(schema, page.data),
    filterable: schema.fields.filter(f => f.is_filterable),
    sortable: schema.fields.filter(f => f.is_sortable),
  }
}
