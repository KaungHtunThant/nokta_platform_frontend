import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBuilderStore } from './useBuilderStore'
import { reorderWithin } from '~/lib/builder/layoutTree'
import type { LayoutNode } from '~/types/schema'

function tree(): LayoutNode {
  return { type: 'section', id: 'root', children: [
    { type: 'field', id: 'a', binding: { field: 'title' } },
    { type: 'field', id: 'b', binding: { field: 'note' } },
  ] }
}

describe('useBuilderStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('loads a layout clean and resolves the selected node', () => {
    const s = useBuilderStore()
    s.load('form', 'deal.form', tree(), 3)
    expect(s.dirty).toBe(false)
    expect(s.baseVersion).toBe(3)

    s.select('b')
    expect(s.selected?.binding?.field).toBe('note')
  })

  it('marks dirty when the tree is replaced and clean again on save', () => {
    const s = useBuilderStore()
    s.load('form', 'deal.form', tree(), 1)

    s.setRoot(reorderWithin(s.root!, 'root', 0, 1))
    expect(s.dirty).toBe(true)
    expect(s.root!.children!.map(c => c.id)).toEqual(['b', 'a'])

    s.markClean(2)
    expect(s.dirty).toBe(false)
    expect(s.baseVersion).toBe(2)
  })
})
