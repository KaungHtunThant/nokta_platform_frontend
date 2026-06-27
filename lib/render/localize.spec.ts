import { describe, it, expect } from 'vitest'
import { localizeLabel } from './localize'

describe('localizeLabel', () => {
  it('passes through plain strings', () => {
    expect(localizeLabel('Deal')).toBe('Deal')
  })

  it('picks the requested locale, falling back to en then first value', () => {
    expect(localizeLabel({ en: 'Deal', ar: 'صفقة' }, 'ar')).toBe('صفقة')
    expect(localizeLabel({ en: 'Deal' }, 'fr')).toBe('Deal')
    expect(localizeLabel({ tr: 'Anlaşma' }, 'en')).toBe('Anlaşma')
  })

  it('returns empty string for null/undefined', () => {
    expect(localizeLabel(null)).toBe('')
    expect(localizeLabel(undefined)).toBe('')
  })
})
