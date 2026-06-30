import { describe, it, expect } from 'vitest'
import { parseRecordRoute } from './recordRoute'

describe('parseRecordRoute', () => {
  it('treats a plain slug as a list', () => {
    expect(parseRecordRoute('contacts')).toEqual({ navSlug: 'contacts', mode: 'list', recordId: null })
  })

  it('detects a trailing numeric id as a detail route', () => {
    expect(parseRecordRoute('contacts/12')).toEqual({ navSlug: 'contacts', mode: 'detail', recordId: 12 })
  })

  it('detects the new verb as a create route', () => {
    expect(parseRecordRoute('patients/new')).toEqual({ navSlug: 'patients', mode: 'create', recordId: null })
  })

  it('detects id + edit as an edit route', () => {
    expect(parseRecordRoute('patients/9/edit')).toEqual({ navSlug: 'patients', mode: 'edit', recordId: 9 })
  })

  it('does not treat a non-numeric trailing segment as an id', () => {
    expect(parseRecordRoute('settings/roles')).toEqual({ navSlug: 'settings/roles', mode: 'list', recordId: null })
  })

  it('handles an empty slug', () => {
    expect(parseRecordRoute('')).toEqual({ navSlug: '', mode: 'list', recordId: null })
  })
})
