<script setup lang="ts">
// Node: `tabs` container. Phase 1 renders its section children stacked; real tabbed UX is a
// later enhancement. Declares `node` (passed by SurfaceRenderer) even though it only slots children.
import type { LayoutNode } from '~/types/schema'
import { tabsStyle } from './nodes.design'

defineProps<{ node: LayoutNode }>()
</script>

<template>
  <div :style="tabsStyle">
    <slot />
  </div>
</template>
