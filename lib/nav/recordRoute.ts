// Pure resolver for the catch-all's record sub-routes. A nav slug can be followed by a record id or
// the `new`/`edit` verbs, e.g. `contacts` (list), `contacts/new` (create), `contacts/12` (detail),
// `contacts/12/edit` (edit). Keeping this pure (no Vue/router) lets the catch-all view and the
// nav-guard middleware share it, and it unit-tests without a DOM.

export type RecordRouteMode = 'list' | 'detail' | 'create' | 'edit'

export interface RecordRoute {
  navSlug: string
  mode: RecordRouteMode
  recordId: number | null
}

function isId(segment: string | undefined): boolean {
  return segment !== undefined && /^\d+$/.test(segment)
}

export function parseRecordRoute(slug: string): RecordRoute {
  const segments = slug.split('/').filter(Boolean)
  const last = segments.at(-1)

  if (last === 'new') {
    return { navSlug: segments.slice(0, -1).join('/'), mode: 'create', recordId: null }
  }

  if (last === 'edit' && isId(segments.at(-2))) {
    return { navSlug: segments.slice(0, -2).join('/'), mode: 'edit', recordId: Number(segments.at(-2)) }
  }

  if (isId(last)) {
    return { navSlug: segments.slice(0, -1).join('/'), mode: 'detail', recordId: Number(last) }
  }

  return { navSlug: segments.join('/'), mode: 'list', recordId: null }
}
