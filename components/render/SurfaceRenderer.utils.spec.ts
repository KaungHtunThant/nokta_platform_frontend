import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { isNodeVisible, evaluateCondition, type LayoutNode } from './SurfaceRenderer.utils'
import { useAbilityStore, type Abilities } from '~/stores/useAbilityStore'

function setAbilities(partial: Partial<Abilities>): void {
  useAbilityStore().setAbilities({
    op: new Set<string>(),
    ui: new Set<string>(),
    stages: {},
    fields: {},
    ...partial,
  })
}

describe('evaluateCondition', () => {
  const values: Record<string, unknown> = { type: 'clinical', score: 5, tags: ['a', 'b'] }
  const get = (k: string) => values[k]

  it('handles eq / ne', () => {
    expect(evaluateCondition({ field: 'type', op: 'eq', value: 'clinical' }, get)).toBe(true)
    expect(evaluateCondition({ field: 'type', op: 'ne', value: 'clinical' }, get)).toBe(false)
  })

  it('handles gt / lt / in / contains', () => {
    expect(evaluateCondition({ field: 'score', op: 'gt', value: 3 }, get)).toBe(true)
    expect(evaluateCondition({ field: 'score', op: 'lt', value: 3 }, get)).toBe(false)
    expect(evaluateCondition({ field: 'type', op: 'in', value: ['clinical', 'admin'] }, get)).toBe(true)
    expect(evaluateCondition({ field: 'tags', op: 'contains', value: 'a' }, get)).toBe(true)
  })
})

describe('isNodeVisible', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('hides a node whose ui permission is not granted', () => {
    setAbilities({ ui: new Set(['ui.section.public']) })
    const node: LayoutNode = { type: 'section', id: '1', permission: { ui: 'ui.section.financials' } }
    expect(isNodeVisible(node)).toBe(false)
  })

  it('shows a node whose ui permission is granted', () => {
    setAbilities({ ui: new Set(['ui.section.financials']) })
    const node: LayoutNode = { type: 'section', id: '1', permission: { ui: 'ui.section.financials' } }
    expect(isNodeVisible(node)).toBe(true)
  })

  it('hides a bound field flagged ui_visible=false for the role', () => {
    setAbilities({ fields: { secret: { canRead: true, canUpdate: true, uiVisible: false } } })
    const node: LayoutNode = { type: 'field', id: '1', binding: { field: 'secret' } }
    expect(isNodeVisible(node)).toBe(false)
  })

  it('shows fields with no configured access row (open by default)', () => {
    setAbilities({})
    const node: LayoutNode = { type: 'field', id: '1', binding: { field: 'title' } }
    expect(isNodeVisible(node)).toBe(true)
  })

  it('evaluates visible_when against surface values when provided', () => {
    setAbilities({})
    const node: LayoutNode = { type: 'field', id: '1', binding: { field: 'dosage' }, visibleWhen: { field: 'type', op: 'eq', value: 'clinical' } }
    expect(isNodeVisible(node, () => 'clinical')).toBe(true)
    expect(isNodeVisible(node, () => 'admin')).toBe(false)
  })

  it('treats visible_when as satisfied when no values are available (nav surface)', () => {
    setAbilities({})
    const node: LayoutNode = { type: 'nav-item', id: '1', visibleWhen: { field: 'type', op: 'eq', value: 'clinical' } }
    expect(isNodeVisible(node)).toBe(true)
  })
})
