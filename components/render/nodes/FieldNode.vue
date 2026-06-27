<script setup lang="ts">
// Node: `field`. Resolves the bound field from the surface context + schema, picks the field-type
// component pair from the registry, and renders the input (form mode) or display (detail mode).
// Tolerant: an unbound/unknown field or unregistered type degrades gracefully, never crashes.
import { computed } from 'vue'
import type { LayoutNode } from '~/types/schema'
import { useSurfaceContext } from '~/lib/render/surfaceContext'
import { resolveFieldType } from '~/lib/registries/fieldTypeRegistry'
import { formatFieldValue } from '~/lib/render/displayValue'
import { fieldRowStyle, fieldLabelStyle } from './nodes.design'

const props = defineProps<{ node: LayoutNode }>()
const ctx = useSurfaceContext()

const field = computed(() => {
  const key = props.node.binding?.field
  return key ? ctx.field(key) : undefined
})

const entry = computed(() => (field.value ? resolveFieldType(field.value.type) : undefined))
</script>

<template>
  <div v-if="field" :style="fieldRowStyle">
    <label :style="fieldLabelStyle">
      {{ field.label }}<span v-if="field.required" style="color: #dd3636"> *</span>
    </label>

    <component
      :is="ctx.mode === 'form' ? entry.input : entry.display"
      v-if="entry"
      :model-value="ctx.getValue(field.key)"
      :value="ctx.getValue(field.key)"
      :field="field"
      @update:model-value="ctx.setValue(field.key, $event)"
    />
    <span v-else>{{ formatFieldValue(field, ctx.getValue(field.key)) }}</span>
  </div>
</template>
