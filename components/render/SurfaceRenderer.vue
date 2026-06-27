<script setup lang="ts">
// VIEW: template + binding only. All logic (resolve node component, evaluate visibility &
// ui-permission) lives in SurfaceRenderer.utils.ts (Controller). This component stays script-light.
import type { LayoutNode } from './SurfaceRenderer.utils'
import { resolveNode, isNodeVisible } from './SurfaceRenderer.utils'

const props = withDefaults(
  defineProps<{ node: LayoutNode, data?: Record<string, unknown> }>(),
  { data: () => ({}) },
)
</script>

<template>
  <template v-if="isNodeVisible(props.node)">
    <component :is="resolveNode(props.node)" :node="props.node" :data="props.data">
      <SurfaceRenderer
        v-for="child in (props.node.children ?? [])"
        :key="child.id"
        :node="child"
        :data="props.data"
      />
    </component>
  </template>
</template>
