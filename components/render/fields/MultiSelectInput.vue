<script setup lang="ts">
// Field input: multiselect (PrimeVue MultiSelect). Value is an array of option keys.
import { computed } from 'vue'
import type { FieldVm } from '~/lib/render/fieldVm'

const props = defineProps<{ modelValue: unknown, field: FieldVm }>()
const emit = defineEmits<{ 'update:modelValue': [unknown] }>()

const options = computed(() => props.field.options.map(o => ({ label: o.label, value: o.key })))
const selected = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []))
</script>

<template>
  <MultiSelect
    :model-value="selected"
    :options="options"
    option-label="label"
    option-value="value"
    :placeholder="props.field.placeholder || 'Select…'"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
