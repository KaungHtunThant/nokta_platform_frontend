import { describe, it, expect } from 'vitest'
import { formatFieldValue } from './displayValue'
import type { FieldVm } from './fieldVm'

function vm(over: Partial<FieldVm> = {}): FieldVm {
  return { key: 'f', type: 'text', label: 'F', required: false, help: null, placeholder: '', options: [], ...over }
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
})
