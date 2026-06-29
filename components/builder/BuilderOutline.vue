<script setup lang="ts">
// VIEW: recursive structural outline of the draft tree. Select a node to inspect it; reorder/remove
// children with the row controls. Edits go through the builder edit controller (pure tree helpers +
// store), so this stays UI-only.
import type { LayoutNode } from '~/types/schema'
import { useBuilderStore } from '~/stores/useBuilderStore'
import { reorderChild, removeNodeById } from '~/lib/builder/edits'
import { nodeLabel } from './BuilderOutline.utils'
import { nodeButtonStyle, nodeSelectedStyle, miniButtonStyle } from './builder.design'

defineProps<{ node: LayoutNode }>()
const store = useBuilderStore()
</script>

<template>
  <div>
    <button
      type="button"
      :style="store.selectedId === node.id ? nodeSelectedStyle : nodeButtonStyle"
      @click="store.select(node.id)"
    >
      {{ nodeLabel(node) }}
    </button>

    <ul v-if="node.children && node.children.length" style="list-style: none; margin: 4px 0 4px 16px; padding: 0">
      <li v-for="(child, i) in node.children" :key="child.id" style="margin-bottom: 4px">
        <span style="display: flex; gap: 2px; align-items: center">
          <button type="button" :style="miniButtonStyle" :disabled="i === 0" @click="reorderChild(node.id, i, i - 1)">↑</button>
          <button type="button" :style="miniButtonStyle" :disabled="i === node.children.length - 1" @click="reorderChild(node.id, i, i + 1)">↓</button>
          <button type="button" :style="miniButtonStyle" @click="removeNodeById(child.id)">✕</button>
          <span style="flex: 1">
            <BuilderOutline :node="child" />
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
