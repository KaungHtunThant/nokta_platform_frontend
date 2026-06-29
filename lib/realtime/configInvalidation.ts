// Live-invalidation controller: re-fetch the cached layout/schema after a tenant config event so the
// runtime (and any open builder session) reflects published changes without a reload. Best-effort.
import { layoutApi, schemaApi } from '~/lib/api/client'
import { useLayoutStore } from '~/stores/useLayoutStore'
import { useSchemaStore } from '~/stores/useSchemaStore'

/** A layout was published — refresh that one surface/key. */
export async function refreshLayout(surface: string, key: string): Promise<void> {
  try {
    useLayoutStore().setLayout(await layoutApi.get(surface, key))
  }
  catch {
    // layout no longer readable for this role — leave the cache as-is
  }
}

/** A field definition changed — refresh every cached entity schema (palette + renderer pick it up). */
export async function refreshSchemas(): Promise<void> {
  const store = useSchemaStore()
  await Promise.all(store.keys.map(async (key) => {
    try {
      store.setSchema(await schemaApi.get(key))
    }
    catch {
      // ignore a single failed refresh
    }
  }))
}
