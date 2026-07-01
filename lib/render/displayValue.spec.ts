import { describe, it, expect } from 'vitest'
import { formatFieldValue } from './displayValue'
import type { FieldVm } from './fieldVm'

function vm(over: Partial<FieldVm> = {}): FieldVm {
  return { key: 'f', type: 'text', label: 'F', required: false, help: null, placeholder: '', options: [], targetEntityType: null, resultType: null, ...over }
}

describe('formatFieldValue', () => {
  it('renders empty values as a dash', () => {
    expect(formatFieldValue(vm(), null)).toBe('—')
    expect(formatFieldValue(vm(), '')).toBe('—')
  })

  it('renders booleans as Yes/No', () => {
    expect(formatFieldValue(vm({ type: 'bool' }), true)).toBe('Yes')
    expect(formatFieldValue(vm({ type: 'bool' }), false)).toBe('No')
  })

  it('maps select/radio values to their option label', () => {
    const f = vm({ type: 'select', options: [{ key: 'high', label: 'High' }] })
    expect(formatFieldValue(f, 'high')).toBe('High')
    expect(formatFieldValue(f, 'unknown')).toBe('unknown')
  })

  it('joins multiselect labels', () => {
    const f = vm({ type: 'multiselect', options: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }] })
    expect(formatFieldValue(f, ['a', 'b'])).toBe('A, B')
  })

  it('formats numeric money/number values', () => {
    expect(formatFieldValue(vm({ type: 'money' }), 1500)).toBe((1500).toLocaleString())
    expect(formatFieldValue(vm({ type: 'number' }), '42')).toBe((42).toLocaleString())
  })

  it('renders a relation value as a record reference (no-component fallback)', () => {
    expect(formatFieldValue(vm({ type: 'relation' }), 7)).toBe('#7')
  })

  it('renders file fields as empty in text (attachments come from the files map)', () => {
    expect(formatFieldValue(vm({ type: 'file' }), 'anything')).toBe('—')
  })

  it('formats a computed field by its result_type', () => {
    // text result → verbatim; number result → localized; bool result → Yes/No.
    expect(formatFieldValue(vm({ type: 'computed', resultType: 'text' }), 'high')).toBe('high')
    expect(formatFieldValue(vm({ type: 'computed', resultType: 'number' }), 1500)).toBe((1500).toLocaleString())
    expect(formatFieldValue(vm({ type: 'computed', resultType: 'bool' }), true)).toBe('Yes')
  })
})
