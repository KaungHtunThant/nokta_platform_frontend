// MODEL layer — pure board state: the active pipeline + one column per stage with its records.
// All mutations are synchronous and pure (no API): a controller util fetches + assigns, and
// performs optimistic moves here, reverting on policy failure. Realtime applies remote moves here.
import { defineStore } from 'pinia'
import type { BoardDto, BoardColumnDto, PipelineDto, RecordDto } from '~/types/dto'

interface State {
  pipeline: PipelineDto | null
  columns: BoardColumnDto[]
}

export const useRecordStore = defineStore('record', {
  state: (): State => ({ pipeline: null, columns: [] }),

  getters: {
    stageIdOf: (s) => (recordId: number): number | null => {
      for (const col of s.columns) {
        if (col.records.some(r => r.id === recordId)) return col.stage.id
      }
      return null
    },
  },

  actions: {
    setBoard(board: BoardDto): void {
      this.pipeline = board.pipeline
      this.columns = board.columns
    },

    /** Relocate a record to another stage's column (optimistic). No-op if not found. */
    moveLocal(recordId: number, toStageId: number): void {
      let moved: RecordDto | undefined

      for (const col of this.columns) {
        const idx = col.records.findIndex(r => r.id === recordId)
        if (idx !== -1) {
          moved = col.records.splice(idx, 1)[0]
          col.meta.total = Math.max(0, col.meta.total - 1)
          break
        }
      }
      if (!moved) return

      const target = this.columns.find(c => c.stage.id === toStageId)
      if (target) {
        moved.stage_id = toStageId
        target.records.unshift(moved)
        target.meta.total += 1
      }
    },

    /** Apply a move broadcast from another client: relocate + refresh the card's data. */
    applyRemoteMove(payload: { id: number, stage_id: number, data: Record<string, unknown> }): void {
      for (const col of this.columns) {
        const record = col.records.find(r => r.id === payload.id)
        if (record) record.data = payload.data
      }
      this.moveLocal(payload.id, payload.stage_id)
    },
  },
})
