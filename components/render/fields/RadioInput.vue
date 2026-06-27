<script setup lang="ts">
// Field input: radio (PrimeVue RadioButton group). One shared model across the options.
import type { FieldVm } from '~/lib/render/fieldVm'
import { radioGroupStyle, radioItemStyle } from './fields.design'

const props = defineProps<{ modelValue: unknown, field: FieldVm }>()
const emit = defineEmits<{ 'update:modelValue': [unknown] }>()
</script>

<template>
  <div :style="radioGroupStyle">
    <label v-for="o in props.field.options" :key="o.key" :style="radioItemStyle">
      <RadioButton
        :model-value="props.modelValue"
        :value="o.key"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <span>{{ o.label }}</span>
    </label>
  </div>
</template>
