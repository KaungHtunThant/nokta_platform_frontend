import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRecordStore } from './useRecordStore'
import type { BoardDto, RecordDto } from '~/types/dto'

function record(id: number, stageId: number, data: Record<string, unknown> = {}): RecordDto {
  return { id, entity_type: 'deal', stage_id: stageId, owner_id: null, status: null, data, created_at: '', updated_at: '' }
}

function board(): BoardDto {
  return {
    pipeline: { id: 1, key: 'sales', label: 'Sales', position: 0 },
    columns: [
      { stage: { id: 10, key: 'new', label: 'New', color: null, position: 0, is_initial: true, is_won: false, is_lost: false },
        records: [record(1, 10), record(2, 10)], meta: { total: 2, per_page: 25, current_page: 1, last_page: 1 } },
      { stage: { id: 11, key: 'won', label: 'Won', color: null, position: 1, is_initial: false, is_won: true, is_lost: false },
        records: [], meta: { total: 0, per_page: 25, current_page: 1, last_page: 1 } },
    ],
  }
}

describe('useRecordStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('reports the current stage of a record', () => {
    const store = useRecordStore()
    store.setBoard(board())
    expect(store.stageIdOf(1)).toBe(10)
    expect(store.stageIdOf(999)).toBeNull()
  })

  it('moves a record between columns and adjusts totals (optimistic)', () => {
    const store = useRecordStore()
    store.setBoard(board())

    store.moveLocal(1, 11)

    expect(store.columns[0]!.records.map(r => r.id)).toEqual([2])
    expect(store.columns[0]!.meta.total).toBe(1)
    expect(store.columns[1]!.records.map(r => r.id)).toEqual([1])
    expect(store.columns[1]!.meta.total).toBe(1)
    expect(store.stageIdOf(1)).toBe(11)
  })

  it('reverts cleanly by moving back', () => {
    const store = useRecordStore()
    store.setBoard(board())
    store.moveLocal(1, 11)
    store.moveLocal(1, 10) // revert
    expect(store.stageIdOf(1)).toBe(10)
    expect(store.columns[0]!.meta.total).toBe(2)
    expect(store.columns[1]!.meta.total).toBe(0)
  })

  it('applies a remote move, relocating and refreshing the card data', () => {
    const store = useRecordStore()
    store.setBoard(board())
    store.applyRemoteMove({ id: 2, stage_id: 11, data: { title: 'Updated remotely' } })
    expect(store.stageIdOf(2)).toBe(11)
    expect(store.columns[1]!.records[0]!.data.title).toBe('Updated remotely')
  })
})
