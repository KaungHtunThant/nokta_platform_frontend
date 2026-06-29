<script setup lang="ts">
// VIEW: the palette of available fields (sourced from the entity's field_definitions). Clicking one
// inserts a bound field node under the selected container (or the root).
import type { FieldDto } from '~/types/schema'
import { addFieldNode } from '~/lib/builder/edits'
import { paletteItemStyle } from './builder.design'

defineProps<{ fields: FieldDto[] }>()
</script>

<template>
  <div>
    <h4 style="margin: 0 0 8px">Fields</h4>
    <button
      v-for="f in fields"
      :key="f.key"
      type="button"
      :style="paletteItemStyle"
      @click="addFieldNode(f.key)"
    >
      + {{ f.label }}
    </button>
  </div>
</template>
