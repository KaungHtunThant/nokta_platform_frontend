// CONTROLLER for the relation field components (input + display): the only place that calls the API.
// Keeps RelationInput.vue / RelationDisplay.vue free of API imports (eslint layer boundary).
import { recordsApi } from '~/lib/api/client'
import type { RecordRefDto } from '~/types/dto'

/** Search records of a target entity type for the picker (empty query = most recent). */
export async function searchRecords(entityType: string, query = ''): Promise<RecordRefDto[]> {
  return await recordsApi.picker(entityType, query)
}

/** Resolve one record's reference {id, label, entity_type} — used to show a current relation value. */
export async function fetchRecordRef(id: number): Promise<RecordRefDto> {
  const record = await recordsApi.get(id)
  return { id: record.id, entity_type: record.entity_type, label: record.label ?? `#${record.id}` }
}
