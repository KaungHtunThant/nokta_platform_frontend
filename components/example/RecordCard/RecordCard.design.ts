// DESIGN module: animation / style logic only. No API calls, no business-data store writes.
import { baseTokens } from '~/design/tokens'

export const cardStyle = {
  background: baseTokens.color.surface,
  color: baseTokens.color.text,
  borderRadius: baseTokens.radius.md,
  padding: baseTokens.space.md,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
}

/** Tiny lift animation on hover (design concern, kept out of the View). */
export const hoverTransition = 'transform 120ms ease, box-shadow 120ms ease'
