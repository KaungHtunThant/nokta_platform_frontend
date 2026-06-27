// Collapse a possibly-localized label ({ en: '…', ar: '…' } | string) to a display string.
// Layout `props.title` and similar locale-keyed values flow through here. Pure -> testable.
export function localizeLabel(value: unknown, locale = 'en'): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    const map = value as Record<string, unknown>
    const picked = map[locale] ?? map.en ?? Object.values(map)[0]
    return picked == null ? '' : String(picked)
  }
  return String(value)
}
