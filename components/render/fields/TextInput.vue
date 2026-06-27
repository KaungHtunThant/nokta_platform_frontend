<script setup lang="ts">
// Field input: text / email / phone (PrimeVue InputText). Generic value contract: emits `unknown`.
import type { FieldVm } from '~/lib/render/fieldVm'

const props = defineProps<{ modelValue: unknown, field: FieldVm }>()
const emit = defineEmits<{ 'update:modelValue': [unknown] }>()
</script>

<template>
  <InputText
    :model-value="props.modelValue == null ? '' : String(props.modelValue)"
    :placeholder="props.field.placeholder"
    @update:model-value="emit('update:modelValue', $event ?? '')"
  />
</template>
