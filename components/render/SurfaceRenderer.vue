<script setup lang="ts">
// VIEW: the one recursive renderer for every surface. Template + binding only; node resolution and
// visibility live in SurfaceRenderer.utils.ts. Values/mode/schema reach `field` nodes via the
// injected surface context (provided by the host), so this component takes only the node.
import { computed } from 'vue'
import type { LayoutNode } from './SurfaceRenderer.utils'
import { resolveNode, isNodeVisible } from './SurfaceRenderer.utils'
import { useSurfaceContextOptional } from '~/lib/render/surfaceContext'

const props = defineProps<{ node: LayoutNode }>()

// Optional: `visible_when` needs record values; nav and other value-less surfaces render without it.
const ctx = useSurfaceContextOptional()
const visible = computed(() => isNodeVisible(props.node, ctx?.getValue))
</script>

<template>
  <template v-if="visible">
    <component :is="resolveNode(props.node)" :node="props.node">
      <SurfaceRenderer
        v-for="child in (props.node.children ?? [])"
        :key="child.id"
        :node="child"
      />
    </component>
  </template>
</template>
