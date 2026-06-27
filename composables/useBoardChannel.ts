// Subscribe to the tenant-scoped board channel and apply remote moves. Best-effort: if Echo is
// not configured (no reverb key), this is a no-op so the board still works without realtime.
import type Echo from 'laravel-echo'

export interface BoardMovePayload {
  id: number
  from_stage_id: number | null
  stage_id: number
  position: number
  data: Record<string, unknown>
}

export function useBoardChannel(
  entityKey: string,
  tenantId: number,
  onMoved: (payload: BoardMovePayload) => void,
): () => void {
  const echo = useNuxtApp().$echo as Echo<'reverb'> | undefined
  if (!echo) return () => {}

  const name = `tenant.${tenantId}.entity.${entityKey}.board`
  echo.private(name).listen('.record.moved', (payload: BoardMovePayload) => onMoved(payload))

  return () => { echo.leave(name) }
}
