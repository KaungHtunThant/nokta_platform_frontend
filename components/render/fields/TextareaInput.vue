<script setup lang="ts">
// Field input: textarea (PrimeVue Textarea).
import type { FieldVm } from '~/lib/render/fieldVm'

const props = defineProps<{ modelValue: unknown, field: FieldVm }>()
const emit = defineEmits<{ 'update:modelValue': [unknown] }>()
</script>

<template>
  <Textarea
    :model-value="props.modelValue == null ? '' : String(props.modelValue)"
    :placeholder="props.field.placeholder"
    rows="3"
    @update:model-value="emit('update:modelValue', $event ?? '')"
  />
</template>
