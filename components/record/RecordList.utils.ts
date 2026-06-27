// CONTROLLER for the RecordList use-case: fetch schema + records (API), cache the schema,
// and return the row view-models. No logic in the View; no API in the stores.
import { schemaApi, recordsApi } from '~/lib/api/client'
import { useSchemaStore } from '~/stores/useSchemaStore'
import { buildRows, type RecordRowVm } from './RecordList.model'

/** Load the entity schema + its records, cache the schema, and return compact row view-models. */
export async function loadList(entityKey: string): Promise<RecordRowVm[]> {
  const [schema, page] = await Promise.all([
    schemaApi.get(entityKey),
    recordsApi.list(entityKey),
  ])

  useSchemaStore().setSchema(schema)

  return buildRows(schema, page.data)
}
