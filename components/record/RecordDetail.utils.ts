// CONTROLLER for the RecordDetail use-case: fetch schema + detail layout + the record (API),
// cache schema/layout. No logic in the View; no API in the stores.
import { schemaApi, layoutApi, recordsApi } from '~/lib/api/client'
import { useSchemaStore } from '~/stores/useSchemaStore'
import { useLayoutStore } from '~/stores/useLayoutStore'
import type { EntitySchemaDto, LayoutDto } from '~/types/schema'
import type { RecordDto } from '~/types/dto'

export interface DetailSurface {
  schema: EntitySchemaDto
  layout: LayoutDto
  record: RecordDto
}

/** Load the entity schema, detail layout, and the record; cache schema + layout. */
export async function loadDetailSurface(entityKey: string, recordId: number): Promise<DetailSurface> {
  const [schema, layout, record] = await Promise.all([
    schemaApi.get(entityKey),
    layoutApi.get('detail', `${entityKey}.detail`),
    recordsApi.get(recordId),
  ])

  useSchemaStore().setSchema(schema)
  useLayoutStore().setLayout(layout)

  return { schema, layout, record }
}
