// DESIGN module for the builder components: styling only.
import { baseTokens } from '~/design/tokens'

export const layoutGridStyle = {
  display: 'grid',
  gridTemplateColumns: '200px 1fr 280px',
  gap: baseTokens.space.md,
  alignItems: 'start',
}

export const panelStyle = {
  border: '1px solid #eef0f3',
  borderRadius: baseTokens.radius.md,
  padding: baseTokens.space.md,
  background: baseTokens.color.surface,
}

export const nodeButtonStyle = {
  display: 'block',
  width: '100%',
  textAlign: 'left' as const,
  padding: `${baseTokens.space.xs} ${baseTokens.space.sm}`,
  border: '1px solid transparent',
  borderRadius: baseTokens.radius.sm,
  background: 'transparent',
  color: baseTokens.color.text,
  cursor: 'pointer',
  font: 'inherit',
}

export const nodeSelectedStyle = {
  ...nodeButtonStyle,
  borderColor: baseTokens.color.accent,
  background: '#eef4fb',
}

export const miniButtonStyle = {
  padding: '0 6px',
  marginRight: '2px',
  border: '1px solid #cbd2d9',
  borderRadius: baseTokens.radius.sm,
  background: baseTokens.color.surface,
  cursor: 'pointer',
  font: 'inherit',
}

export const paletteItemStyle = {
  display: 'block',
  width: '100%',
  textAlign: 'left' as const,
  marginBottom: baseTokens.space.xs,
  padding: `${baseTokens.space.xs} ${baseTokens.space.sm}`,
  border: '1px dashed #cbd2d9',
  borderRadius: baseTokens.radius.sm,
  background: baseTokens.color.surface,
  cursor: 'pointer',
  font: 'inherit',
}

export const fieldStyle = {
  display: 'grid',
  gap: baseTokens.space.xs,
  marginBottom: baseTokens.space.sm,
  fontSize: '13px',
  color: baseTokens.color.muted,
}

export const inputStyle = {
  padding: `${baseTokens.space.xs} ${baseTokens.space.sm}`,
  border: '1px solid #cbd2d9',
  borderRadius: baseTokens.radius.sm,
  font: 'inherit',
}

export const toolbarStyle = {
  display: 'flex',
  gap: baseTokens.space.sm,
  alignItems: 'center',
  marginBottom: baseTokens.space.md,
}
