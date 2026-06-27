<script setup lang="ts">
// Node: `section` (and generic containers: row/col/group). Renders an optional localized title
// then its child nodes via the slot.
import { computed } from 'vue'
import type { LayoutNode } from '~/types/schema'
import { localizeLabel } from '~/lib/render/localize'
import { sectionStyle, sectionTitleStyle } from './nodes.design'

const props = defineProps<{ node: LayoutNode }>()

const title = computed(() => localizeLabel((props.node.props as { title?: unknown } | undefined)?.title))
</script>

<template>
  <section :style="sectionStyle">
    <h3 v-if="title" :style="sectionTitleStyle">{{ title }}</h3>
    <slot />
  </section>
</template>
