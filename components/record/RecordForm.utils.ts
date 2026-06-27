// CONTROLLER for the RecordForm use-case: fetch schema + form layout (+ the record when editing),
// cache schema/layout, and submit. No logic in the View; no API in the stores.
import { schemaApi, layoutApi, recordsApi } from '~/lib/api/client'
import { useSchemaStore } from '~/stores/useSchemaStore'
import { useLayoutStore } from '~/stores/useLayoutStore'
import type { EntitySchemaDto, LayoutDto } from '~/types/schema'
import type { RecordDto } from '~/types/dto'

export interface FormSurface {
  schema: EntitySchemaDto
  layout: LayoutDto
  record: RecordDto | null
}

/** Load the entity schema + form layout (and the record when editing); cache schema + layout. */
export async function loadFormSurface(entityKey: string, recordId?: number): Promise<FormSurface> {
  const [schema, layout, record] = await Promise.all([
    schemaApi.get(entityKey),
    layoutApi.get('form', `${entityKey}.form`),
    recordId != null ? recordsApi.get(recordId) : Promise.resolve(null),
  ])

  useSchemaStore().setSchema(schema)
  useLayoutStore().setLayout(layout)

  return { schema, layout, record }
}

/** Persist the form values: create a new record, or update an existing one. */
export async function submitForm(entityKey: string, values: Record<string, unknown>, recordId?: number) {
  return recordId == null
    ? recordsApi.create(entityKey, { data: values })
    : recordsApi.update(recordId, { data: values })
}
