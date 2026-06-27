// CONTROLLER for the RecordForm use-case: fetch schema + layout (API), assign to stores,
// and submit. No logic in the View; no API in the stores.
import { schemaApi, layoutApi, recordsApi } from '~/lib/api/client'
import { useSchemaStore } from '~/stores/useSchemaStore'
import { useLayoutStore } from '~/stores/useLayoutStore'
import { buildFormFields, type FormFieldVm } from './RecordForm.model'

/** Load the entity schema + form layout, cache them, and return the ordered field view-models. */
export async function loadForm(entityKey: string): Promise<FormFieldVm[]> {
  const [schema, layout] = await Promise.all([
    schemaApi.get(entityKey),
    layoutApi.get('form', `${entityKey}.form`),
  ])

  useSchemaStore().setSchema(schema)
  useLayoutStore().setLayout(layout)

  return buildFormFields(schema, layout.schema)
}

/** Persist the form values as a new record. */
export async function submitForm(entityKey: string, values: Record<string, unknown>) {
  return recordsApi.create(entityKey, { data: values })
}
