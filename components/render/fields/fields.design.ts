// DESIGN module for render field inputs: styling only.
import { baseTokens } from '~/design/tokens'

export const radioGroupStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: baseTokens.space.md,
}

export const radioItemStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: baseTokens.space.xs,
  cursor: 'pointer',
}
