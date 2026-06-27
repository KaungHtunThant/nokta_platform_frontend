// DESIGN module: styling only (no API, no business logic).
import { baseTokens } from '~/design/tokens'

export const formStyle = {
  display: 'grid',
  gap: baseTokens.space.md,
  maxWidth: '640px',
}

export const labelStyle = {
  display: 'block',
  marginBottom: baseTokens.space.xs,
  color: baseTokens.color.muted,
  fontSize: '13px',
}
