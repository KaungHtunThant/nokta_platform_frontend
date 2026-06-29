// DESIGN module for FilterSortBar: styling only.
import { baseTokens } from '~/design/tokens'

export const barStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  alignItems: 'flex-end',
  gap: baseTokens.space.sm,
  marginBottom: baseTokens.space.md,
}

export const labelStyle = {
  display: 'grid',
  gap: baseTokens.space.xs,
  fontSize: '13px',
  color: baseTokens.color.muted,
}

export const controlStyle = {
  padding: `${baseTokens.space.xs} ${baseTokens.space.sm}`,
  border: '1px solid #cbd2d9',
  borderRadius: baseTokens.radius.md,
  font: 'inherit',
}
