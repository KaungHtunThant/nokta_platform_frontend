// CONTROLLER for the related-records node: the only place it calls the API. Keeps the .vue free of
// API imports (eslint layer boundary).
import { recordsApi } from '~/lib/api/client'
import { slugForEntity } from '~/lib/nav/navModel'
import type { RecordRefDto } from '~/types/dto'
import type { LayoutNode } from '~/types/schema'

/** Records linked to `recordId`, optionally narrowed to one relation key. */
export async function loadRelated(recordId: number, relationKey?: string): Promise<RecordRefDto[]> {
  return await recordsApi.related(recordId, relationKey)
}

/** The detail-page path for a related record, or null if its entity type has no nav slug. */
export function linkForRelated(nav: LayoutNode | null, item: RecordRefDto): string | null {
  const slug = item.entity_type ? slugForEntity(nav, item.entity_type) : null
  return slug ? `/${slug}/${item.id}` : null
}
