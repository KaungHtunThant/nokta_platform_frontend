<script setup lang="ts">
// Field input: number / decimal / money (PrimeVue InputNumber).
import { computed } from 'vue'
import type { FieldVm } from '~/lib/render/fieldVm'

const props = defineProps<{ modelValue: unknown, field: FieldVm }>()
const emit = defineEmits<{ 'update:modelValue': [unknown] }>()

const num = computed<number | null>(() => {
  if (typeof props.modelValue === 'number') return props.modelValue
  if (props.modelValue == null || props.modelValue === '') return null
  const n = Number(props.modelValue)
  return Number.isFinite(n) ? n : null
})
</script>

<template>
  <InputNumber
    :model-value="num"
    :placeholder="props.field.placeholder"
    :max-fraction-digits="props.field.type === 'number' ? 0 : 2"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
