import { describe, it, expect } from 'vitest'
import { moveErrorMessage } from './KanbanBoard.model'

describe('moveErrorMessage', () => {
  it('extracts the stage rejection reason from a 422 body', () => {
    const err = { data: { message: 'The given data was invalid.', errors: { stage: ['Cannot move to "won": required fields missing: budget.'] } } }
    expect(moveErrorMessage(err)).toContain('budget')
  })

  it('falls back to the top-level message, then a default', () => {
    expect(moveErrorMessage({ data: { message: 'Boom' } })).toBe('Boom')
    expect(moveErrorMessage(null)).toBe('This move was rejected.')
    expect(moveErrorMessage({})).toBe('This move was rejected.')
  })
})
