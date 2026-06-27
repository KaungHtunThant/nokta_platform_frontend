// DESIGN module for render node components: styling only.
import { baseTokens } from '~/design/tokens'

export const tabsStyle = {
  display: 'grid',
  gap: baseTokens.space.lg,
}

export const sectionStyle = {
  display: 'grid',
  gap: baseTokens.space.sm,
  border: '1px solid #eef0f3',
  borderRadius: baseTokens.radius.md,
  padding: baseTokens.space.md,
}

export const sectionTitleStyle = {
  margin: 0,
  fontSize: '15px',
  color: baseTokens.color.primary,
}

export const fieldRowStyle = {
  display: 'grid',
  gap: baseTokens.space.xs,
}

export const fieldLabelStyle = {
  fontSize: '13px',
  color: baseTokens.color.muted,
}
