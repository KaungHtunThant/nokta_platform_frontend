// CONTROLLER for the Kanban use-case: fetch board + card layout + schema (API), assign the board
// store, and perform optimistic moves with rollback on policy rejection. No API in the View/store.
import { schemaApi, layoutApi, boardApi, recordsApi } from '~/lib/api/client'
import { useRecordStore } from '~/stores/useRecordStore'
import { toFieldVm, type FieldVm } from '~/lib/render/fieldVm'
import type { LayoutNode } from '~/types/schema'
import { moveErrorMessage } from './KanbanBoard.model'

export interface BoardView {
  cardNode: LayoutNode
  fields: Map<string, FieldVm>
}

/** Load the board (into the store) plus the card layout + schema needed to render each card. */
export async function loadBoard(entityKey: string): Promise<BoardView> {
  const [schema, board, cardLayout] = await Promise.all([
    schemaApi.get(entityKey),
    boardApi.get(entityKey),
    layoutApi.get('card', `${entityKey}.card`),
  ])

  useRecordStore().setBoard(board)

  return {
    cardNode: cardLayout.schema,
    fields: new Map(schema.fields.map(f => [f.key, toFieldVm(f)])),
  }
}

/**
 * Optimistically move a card to a new stage, then persist. On a policy rejection the local move is
 * reverted and the reason is thrown for the View to surface.
 */
export async function moveCard(
  recordId: number,
  fromStageId: number,
  toStageId: number,
  comment?: string,
): Promise<void> {
  if (fromStageId === toStageId) return

  const store = useRecordStore()
  store.moveLocal(recordId, toStageId)

  const payload = comment === undefined ? { stage_id: toStageId } : { stage_id: toStageId, comment }

  try {
    await recordsApi.move(recordId, payload)
  }
  catch (error) {
    store.moveLocal(recordId, fromStageId) // revert
    throw new Error(moveErrorMessage(error))
  }
}
