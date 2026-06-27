// MODEL (pure helpers) for the Kanban use-case.
// Extracts a human-readable reason from a rejected move (the StageTransitionPolicy 422 body),
// so the board can surface exactly why a drag was blocked. Pure -> unit-testable.

interface MoveErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

/** Pull the clearest rejection reason from an ofetch error thrown by a blocked move. */
export function moveErrorMessage(error: unknown): string {
  const body = (error as { data?: MoveErrorBody } | null)?.data
  const stage = body?.errors?.stage
  if (Array.isArray(stage) && stage.length > 0) {
    return stage[0]!
  }
  return body?.message ?? 'This move was rejected.'
}
