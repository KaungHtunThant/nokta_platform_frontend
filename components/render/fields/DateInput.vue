<script setup lang="ts">
// Field input: date / datetime (PrimeVue DatePicker). Stores an ISO string; binds a Date to the picker.
import { computed } from 'vue'
import type { FieldVm } from '~/lib/render/fieldVm'

const props = defineProps<{ modelValue: unknown, field: FieldVm }>()
const emit = defineEmits<{ 'update:modelValue': [unknown] }>()

const withTime = computed(() => props.field.type === 'datetime')

const asDate = computed<Date | null>(() => {
  if (props.modelValue instanceof Date) return props.modelValue
  if (typeof props.modelValue === 'string' && props.modelValue !== '') {
    const d = new Date(props.modelValue)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
})

function onUpdate(value: unknown): void {
  const d = Array.isArray(value) ? value[0] : value
  if (!(d instanceof Date)) {
    emit('update:modelValue', '')
    return
  }
  emit('update:modelValue', withTime.value ? d.toISOString() : d.toISOString().slice(0, 10))
}
</script>

<template>
  <DatePicker
    :model-value="asDate"
    :show-time="withTime"
    :placeholder="props.field.placeholder"
    show-icon
    @update:model-value="onUpdate"
  />
</template>
