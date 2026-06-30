// Route guard for the catch-all dynamic view: enforces ui.nav.* (generalizes the old static
// requirePermission). Resolves the slug to a nav entry from the loaded nav layout; an unknown slug
// is a 404 and a slug whose ui permission the role lacks is a 403. This only gates the UI route —
// every API call the view makes is independently re-checked server-side by the op guard.
import { resolveNavEntry } from '~/lib/nav/navModel'
import { parseRecordRoute } from '~/lib/nav/recordRoute'
import { useLayoutStore } from '~/stores/useLayoutStore'
import { useAbilityStore } from '~/stores/useAbilityStore'

export default defineNuxtRouteMiddleware((to) => {
  const slug = Array.isArray(to.params.slug) ? to.params.slug.join('/') : String(to.params.slug ?? '')
  const nav = useLayoutStore().get('nav', 'main')?.schema ?? null
  // A record sub-route (…/12, …/new, …/12/edit) is gated by the same nav permission as its list.
  const entry = resolveNavEntry(nav, parseRecordRoute(slug).navSlug)

  if (!entry) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  if (entry.ui && !useAbilityStore().canSee(entry.ui)) {
    throw createError({ statusCode: 403, statusMessage: 'You do not have access to this page.' })
  }
})
