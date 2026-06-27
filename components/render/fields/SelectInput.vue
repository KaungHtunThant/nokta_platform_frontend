<script setup lang="ts">
// Field input: select / radio-as-dropdown (PrimeVue Select). Options come from the FieldVm.
import { computed } from 'vue'
import type { FieldVm } from '~/lib/render/fieldVm'

const props = defineProps<{ modelValue: unknown, field: FieldVm }>()
const emit = defineEmits<{ 'update:modelValue': [unknown] }>()

const options = computed(() => props.field.options.map(o => ({ label: o.label, value: o.key })))
</script>

<template>
  <Select
    :model-value="props.modelValue"
    :options="options"
    option-label="label"
    option-value="value"
    :placeholder="props.field.placeholder || 'Select…'"
    show-clear
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
