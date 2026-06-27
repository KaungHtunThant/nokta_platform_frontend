<script setup lang="ts">
// Host for a single board card: provides a read-only surface context for one record and renders
// the `card` layout through the SAME SurfaceRenderer as form/detail — so editing the card layout
// (via API) changes card content with zero code change.
import SurfaceRenderer from '~/components/render/SurfaceRenderer.vue'
import { provideSurfaceContext } from '~/lib/render/surfaceContext'
import type { FieldVm } from '~/lib/render/fieldVm'
import type { LayoutNode } from '~/types/schema'

const props = defineProps<{
  fields: Map<string, FieldVm>
  data: Record<string, unknown>
  cardNode: LayoutNode
}>()

provideSurfaceContext({
  mode: 'detail',
  field: key => props.fields.get(key),
  getValue: key => props.data[key],
  setValue: () => { /* cards are read-only */ },
})
</script>

<template>
  <SurfaceRenderer :node="props.cardNode" />
</template>
