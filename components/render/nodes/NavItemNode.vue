<script setup lang="ts">
// Node: `nav-item`. Renders one navigation link from the resolved `nav` layout. The SurfaceRenderer
// already hides this node when the role lacks its `permission.ui` (ui.nav.*), so reaching the
// template means the item is permitted. Navigates to the slug — resolved by the catch-all route.
import { computed } from 'vue'
import type { LayoutNode } from '~/types/schema'
import { localizeLabel } from '~/lib/render/localize'
import { navItemStyle } from './nodes.design'

const props = defineProps<{ node: LayoutNode }>()

const slug = computed(() => String(props.node.props?.slug ?? ''))
const label = computed(() => localizeLabel(props.node.props?.label) || slug.value)
const icon = computed(() => (typeof props.node.props?.icon === 'string' ? props.node.props.icon : null))
</script>

<template>
  <NuxtLink :to="`/${slug}`" :style="navItemStyle">
    <i v-if="icon" :class="`pi ${icon}`" />
    <span>{{ label }}</span>
  </NuxtLink>
</template>
