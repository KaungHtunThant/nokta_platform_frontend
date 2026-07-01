import { describe, it, expect } from 'vitest'
import { toFieldVm, resolveFieldOptions } from './fieldVm'
import type { FieldDto } from '~/types/schema'

function field(over: Partial<FieldDto> = {}): FieldDto {
  return { key: 'title', type: 'text', label: 'Title', validation: {}, ui: {}, default_value: null, position: 0, ...over }
}

describe('toFieldVm', () => {
  it('maps identity, required flag, help and placeholder', () => {
    const vm = toFieldVm(field({ validation: { required: true }, help: 'hint', ui: { placeholder: 'Enter…' } }))
    expect(vm).toMatchObject({ key: 'title', type: 'text', label: 'Title', required: true, help: 'hint', placeholder: 'Enter…' })
  })

  it('defaults required=false, help=null, placeholder="" when absent', () => {
    const vm = toFieldVm(field())
    expect(vm).toMatchObject({ required: false, help: null, placeholder: '', targetEntityType: null })
  })

  it('reads a relation field\'s target entity type from ui', () => {
    const vm = toFieldVm(field({ type: 'relation', ui: { target_entity_type: 'contact' } }))
    expect(vm.targetEntityType).toBe('contact')
  })

  it('reads a computed field\'s result_type from ui', () => {
    const vm = toFieldVm(field({ type: 'computed', ui: { expression: 'a ~ b', result_type: 'number' } }))
    expect(vm.resultType).toBe('number')
    expect(toFieldVm(field()).resultType).toBeNull()
  })
})

describe('resolveFieldOptions', () => {
  it('prefers persisted field_options over inline ui.options', () => {
    const f = field({
      options: [{ key: 'a', label: 'A' }],
      ui: { options: [{ key: 'b', label: { en: 'B' } }] },
    })
    expect(resolveFieldOptions(f)).toEqual([{ key: 'a', label: 'A' }])
  })

  it('falls back to inline ui.options, collapsing localized labels', () => {
    const f = field({ ui: { options: [{ key: 'low', label: { en: 'Low' } }, { key: 'hi', label: 'Hi' }] } })
    expect(resolveFieldOptions(f)).toEqual([{ key: 'low', label: 'Low' }, { key: 'hi', label: 'Hi' }])
  })
})
