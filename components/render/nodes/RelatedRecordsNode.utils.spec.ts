import { describe, it, expect } from 'vitest'
import { linkForRelated } from './RelatedRecordsNode.utils'
import type { LayoutNode } from '~/types/schema'

const nav: LayoutNode = {
  type: 'nav', id: 'root', children: [
    { type: 'nav-item', id: 'l', props: { slug: 'leads', viewType: 'list', entityType: 'deal' } },
  ],
}

describe('linkForRelated', () => {
  it('builds a detail path from the related record\'s entity nav slug', () => {
    expect(linkForRelated(nav, { id: 5, entity_type: 'deal', label: 'Deal' })).toBe('/leads/5')
  })

  it('returns null when the entity type has no nav slug', () => {
    expect(linkForRelated(nav, { id: 5, entity_type: 'patient', label: 'P' })).toBeNull()
    expect(linkForRelated(nav, { id: 5, entity_type: null, label: 'P' })).toBeNull()
  })
})
