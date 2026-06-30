import { describe, it, expect } from 'vitest'
import { navEntries, resolveNavEntry, slugForEntity } from './navModel'
import type { LayoutNode } from '~/types/schema'

const nav: LayoutNode = {
  type: 'nav',
  id: 'root',
  children: [
    {
      type: 'nav-item',
      id: 'n1',
      permission: { ui: 'ui.nav.boards' },
      props: { slug: 'deals', label: { en: 'Deals' }, icon: 'pi-briefcase', viewType: 'kanban-board', entityType: 'deal', pipeline: 'sales', layoutKey: 'deal.board' },
    },
    {
      type: 'nav-item',
      id: 'n2',
      permission: { ui: 'ui.nav.list' },
      props: { slug: 'contacts', label: 'Contacts', viewType: 'list', entityType: 'contact' },
    },
  ],
}

describe('navModel', () => {
  it('flattens nav-item nodes into typed entries', () => {
    const entries = navEntries(nav)
    expect(entries).toHaveLength(2)
    expect(entries[0]).toMatchObject({ slug: 'deals', label: 'Deals', viewType: 'kanban-board', entityType: 'deal', pipeline: 'sales', ui: 'ui.nav.boards' })
    expect(entries[1]).toMatchObject({ slug: 'contacts', label: 'Contacts', viewType: 'list', entityType: 'contact', pipeline: null, ui: 'ui.nav.list' })
  })

  it('resolves a slug to its entry', () => {
    expect(resolveNavEntry(nav, 'contacts')?.entityType).toBe('contact')
    expect(resolveNavEntry(nav, 'missing')).toBeUndefined()
  })

  it('returns nothing for an empty layout', () => {
    expect(navEntries(null)).toEqual([])
  })

  it('resolves the nav slug for an entity type (used to link to a related record)', () => {
    expect(slugForEntity(nav, 'contact')).toBe('contacts')
    expect(slugForEntity(nav, 'deal')).toBe('deals')
    expect(slugForEntity(nav, 'unknown')).toBeNull()
  })

  it('prefers a list entry over a board entry when an entity has both', () => {
    const withBoardAndList: LayoutNode = {
      type: 'nav', id: 'root', children: [
        { type: 'nav-item', id: 'b', props: { slug: 'pipeline', viewType: 'kanban-board', entityType: 'deal' } },
        { type: 'nav-item', id: 'l', props: { slug: 'leads', viewType: 'list', entityType: 'deal' } },
      ],
    }
    expect(slugForEntity(withBoardAndList, 'deal')).toBe('leads')
  })
})
