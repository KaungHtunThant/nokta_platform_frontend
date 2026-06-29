import { describe, it, expect } from 'vitest'
import { findNode, parentOf, updateNode, removeNode, insertNode, reorderWithin, moveNode } from './layoutTree'
import type { LayoutNode } from '~/types/schema'

function tree(): LayoutNode {
  return {
    type: 'section', id: 'root', children: [
      { type: 'field', id: 'a', binding: { field: 'title' } },
      { type: 'group', id: 'g', children: [{ type: 'field', id: 'b', binding: { field: 'note' } }] },
    ],
  }
}

describe('layoutTree', () => {
  it('finds nodes and parents', () => {
    const t = tree()
    expect(findNode(t, 'b')?.binding?.field).toBe('note')
    expect(parentOf(t, 'b')?.id).toBe('g')
    expect(parentOf(t, 'root')).toBeUndefined()
  })

  it('updates a node immutably', () => {
    const t = tree()
    const next = updateNode(t, 'a', { permission: { ui: 'ui.field.secret' } })
    expect(findNode(next, 'a')?.permission?.ui).toBe('ui.field.secret')
    expect(findNode(t, 'a')?.permission).toBeUndefined() // original untouched
  })

  it('removes a node', () => {
    const next = removeNode(tree(), 'a')
    expect(findNode(next, 'a')).toBeUndefined()
    expect(next.children).toHaveLength(1)
  })

  it('inserts a node at an index', () => {
    const node: LayoutNode = { type: 'field', id: 'new', binding: { field: 'budget' } }
    const next = insertNode(tree(), 'root', node, 0)
    expect(next.children?.[0]?.id).toBe('new')
  })

  it('reorders children within a parent', () => {
    const next = reorderWithin(tree(), 'root', 0, 1)
    expect(next.children?.map(c => c.id)).toEqual(['g', 'a'])
  })

  it('moves a node into another parent', () => {
    const next = moveNode(tree(), 'a', 'g', 0)
    expect(findNode(next, 'g')?.children?.map(c => c.id)).toEqual(['a', 'b'])
    expect(parentOf(next, 'a')?.id).toBe('g')
  })
})
