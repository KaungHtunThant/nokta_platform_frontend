// Logic is in pure TS (model + utils), so it is unit-testable without mounting the View.
import { describe, it, expect } from 'vitest'
import { toRecordCardModel } from './RecordCard.model'
import type { RecordDto } from '~/types/dto'

describe('toRecordCardModel', () => {
  it('maps a DTO into the precise card model (DTO never leaks into the store)', () => {
    const dto: RecordDto = {
      id: 7,
      entity_type: 'deal',
      stage_id: 3,
      owner_id: 11,
      data: { title: 'Knee surgery — A. Patient' },
      created_at: '2026-06-01T10:00:00Z',
      updated_at: '2026-06-02T12:30:00Z',
    }
    expect(toRecordCardModel(dto)).toEqual({
      id: 7,
      title: 'Knee surgery — A. Patient',
      stageId: 3,
      ownerId: 11,
      updatedAt: '2026-06-02T12:30:00Z',
    })
  })

  it('falls back to an id-based title when no title/name field is present', () => {
    const dto: RecordDto = {
      id: 9, entity_type: 'deal', stage_id: null, owner_id: null,
      data: {}, created_at: 'x', updated_at: 'y',
    }
    expect(toRecordCardModel(dto).title).toBe('#9')
  })
})
