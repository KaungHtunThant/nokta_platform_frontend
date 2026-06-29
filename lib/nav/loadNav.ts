// Nav controller util: fetches the tenant's resolved `nav` layout and caches it in the layout store.
// Tolerant — a tenant with no nav layout simply renders no dynamic navigation.
import { layoutApi } from '~/lib/api/client'
import { useLayoutStore } from '~/stores/useLayoutStore'

export async function loadNav(key = 'main'): Promise<void> {
  try {
    const layout = await layoutApi.get('nav', key)
    useLayoutStore().setLayout(layout)
  }
  catch {
    // no nav configured for this tenant (or not yet permitted) — fall back to no dynamic nav
  }
}
