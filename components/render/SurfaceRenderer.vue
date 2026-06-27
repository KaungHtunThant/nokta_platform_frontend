<script setup lang="ts">
// VIEW: the one recursive renderer for every surface. Template + binding only; node resolution and
// visibility live in SurfaceRenderer.utils.ts. Values/mode/schema reach `field` nodes via the
// injected surface context (provided by the host), so this component takes only the node.
import type { LayoutNode } from './SurfaceRenderer.utils'
import { resolveNode, isNodeVisible } from './SurfaceRenderer.utils'

const props = defineProps<{ node: LayoutNode }>()
</script>

<template>
  <template v-if="isNodeVisible(props.node)">
    <component :is="resolveNode(props.node)" :node="props.node">
      <SurfaceRenderer
        v-for="child in (props.node.children ?? [])"
        :key="child.id"
        :node="child"
      />
    </component>
  </template>
</template>
