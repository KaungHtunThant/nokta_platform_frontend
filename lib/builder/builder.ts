// Builder CONTROLLER util: orchestrates the layout API + schema + builder store. Views call these;
// they never touch the API client directly. Tree edits themselves are pure (lib/builder/layoutTree).
import type { LayoutVersionDto } from '~/types/dto'
import type { FieldDto } from '~/types/schema'
import { layoutApi, schemaApi } from '~/lib/api/client'
import { useBuilderStore } from '~/stores/useBuilderStore'
import { useSchemaStore } from '~/stores/useSchemaStore'

/** Load a layout + its entity schema into the builder for editing. Returns the palette fields. */
export async function loadForEdit(surface: string, key: string, entityKey: string): Promise<FieldDto[]> {
  const [layout, schema] = await Promise.all([layoutApi.get(surface, key), schemaApi.get(entityKey)])
  useSchemaStore().setSchema(schema)
  useBuilderStore().load(surface, key, layout.schema, layout.version)
  return schema.fields
}

/** Persist the current draft as a new version. Returns the created version number. */
export async function saveDraft(note?: string): Promise<number> {
  const store = useBuilderStore()
  if (!store.surface || !store.key || !store.root) throw new Error('No layout loaded.')

  const payload = note === undefined ? { schema: store.root } : { schema: store.root, note }
  const version = await layoutApi.saveVersion(store.surface, store.key, payload)
  store.markClean(version.version)
  return version.version
}

/** Save (if dirty) then publish the latest draft so it becomes the live layout. */
export async function saveAndPublish(note?: string): Promise<void> {
  const store = useBuilderStore()
  if (!store.surface || !store.key) throw new Error('No layout loaded.')

  const version = await saveDraft(note)
  await layoutApi.publish(store.surface, store.key, version)
}

export async function rollbackTo(version: number): Promise<void> {
  const store = useBuilderStore()
  if (!store.surface || !store.key) throw new Error('No layout loaded.')

  const layout = await layoutApi.rollback(store.surface, store.key, version)
  store.load(store.surface, store.key, layout.schema, layout.version)
}

export async function loadVersions(): Promise<LayoutVersionDto[]> {
  const store = useBuilderStore()
  if (!store.surface || !store.key) return []

  const res = await layoutApi.versions(store.surface, store.key)
  return res.data
}
