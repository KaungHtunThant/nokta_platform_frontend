// DESIGN module for NavMenu: styling only.
import { baseTokens } from '~/design/tokens'

export const navMenuStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: baseTokens.space.sm,
  marginBottom: baseTokens.space.lg,
  paddingBottom: baseTokens.space.sm,
  borderBottom: '1px solid #eef0f3',
}
