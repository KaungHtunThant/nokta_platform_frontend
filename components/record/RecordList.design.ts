// DESIGN module: styling only (no API, no business logic).
import { baseTokens } from '~/design/tokens'

export const listStyle = {
  display: 'grid',
  gap: baseTokens.space.xs,
  maxWidth: '640px',
}

export const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${baseTokens.space.sm} ${baseTokens.space.md}`,
  border: `1px solid #eef0f3`,
  borderRadius: baseTokens.radius.md,
  background: baseTokens.color.surface,
  color: baseTokens.color.text,
  cursor: 'pointer',
  textAlign: 'left' as const,
  font: 'inherit',
}

export const statusStyle = {
  color: baseTokens.color.muted,
  fontSize: '13px',
}
