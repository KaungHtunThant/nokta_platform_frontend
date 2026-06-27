<script setup lang="ts">
// Field input: bool / checkbox (PrimeVue ToggleSwitch).
import type { FieldVm } from '~/lib/render/fieldVm'

const props = defineProps<{ modelValue: unknown, field: FieldVm }>()
const emit = defineEmits<{ 'update:modelValue': [unknown] }>()
</script>

<template>
  <ToggleSwitch
    :model-value="Boolean(props.modelValue)"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
