// DESIGN module for the Kanban board: styling only.
import { baseTokens } from '~/design/tokens'

export const boardStyle = {
  display: 'flex',
  gap: baseTokens.space.md,
  alignItems: 'flex-start',
  overflowX: 'auto' as const,
  padding: `${baseTokens.space.sm} 0`,
}

export const columnStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: baseTokens.space.sm,
  minWidth: '260px',
  maxWidth: '300px',
  background: '#f6f7f9',
  borderRadius: baseTokens.radius.md,
  padding: baseTokens.space.sm,
}

export const columnHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 600,
  fontSize: '13px',
  color: baseTokens.color.text,
  padding: `${baseTokens.space.xs} ${baseTokens.space.xs}`,
}

export const countStyle = {
  color: baseTokens.color.muted,
  fontWeight: 400,
}

export const cardWrapStyle = {
  cursor: 'grab',
  background: baseTokens.color.surface,
  borderRadius: baseTokens.radius.md,
  boxShadow: '0 1px 2px rgba(16,24,40,0.08)',
}

export const errorStyle = {
  background: '#fdecec',
  color: baseTokens.color.danger,
  borderRadius: baseTokens.radius.md,
  padding: `${baseTokens.space.sm} ${baseTokens.space.md}`,
  marginBottom: baseTokens.space.md,
  fontSize: '13px',
}
