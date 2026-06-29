import { describe, it, expect } from 'vitest'
import { toAbilities } from './abilities'
import type { AbilitiesDto } from '~/types/dto'

function dto(overrides: Partial<AbilitiesDto> = {}): AbilitiesDto {
  return {
    op: ['record.read', 'record.update'],
    ui: ['ui.nav.boards'],
    stages: { 10: { can_move_from: true, can_move_to: false, can_view: true } },
    fields: { secret: { can_read: true, can_update: false, ui_visible: false } },
    ...overrides,
  }
}

describe('toAbilities', () => {
  it('maps op/ui arrays into membership sets', () => {
    const a = toAbilities(dto())
    expect(a.op.has('record.read')).toBe(true)
    expect(a.op.has('record.delete')).toBe(false)
    expect(a.ui.has('ui.nav.boards')).toBe(true)
  })

  it('maps the stage matrix with numeric keys and camelCased flags', () => {
    const a = toAbilities(dto())
    expect(a.stages[10]).toEqual({ canMoveFrom: true, canMoveTo: false, canView: true })
  })

  it('maps the field matrix preserving deny flags', () => {
    const a = toAbilities(dto())
    expect(a.fields.secret).toEqual({ canRead: true, canUpdate: false, uiVisible: false })
  })

  it('tolerates missing matrices', () => {
    const a = toAbilities({ op: [], ui: [] } as unknown as AbilitiesDto)
    expect(a.stages).toEqual({})
    expect(a.fields).toEqual({})
    expect(a.op.size).toBe(0)
  })
})
