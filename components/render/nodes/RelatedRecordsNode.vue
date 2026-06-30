<script setup lang="ts">
// Node: `related-records`. Lists the records linked to the current detail record (via record_links),
// optionally filtered to one relation key (props.relationKey). Renders for ANY entity type — no
// entity-specific code. Degrades gracefully outside a detail surface (no recordId).
import { ref, computed, onMounted } from 'vue'
import type { LayoutNode } from '~/types/schema'
import type { RecordRefDto } from '~/types/dto'
import { useSurfaceContext } from '~/lib/render/surfaceContext'
import { localizeLabel } from '~/lib/render/localize'
import { useLayoutStore } from '~/stores/useLayoutStore'
import { loadRelated, linkForRelated } from './RelatedRecordsNode.utils'
import { sectionStyle, sectionTitleStyle } from './nodes.design'

const props = defineProps<{ node: LayoutNode }>()
const ctx = useSurfaceContext()

const items = ref<RecordRefDto[]>([])
const loading = ref(true)

const relationKey = computed(() => {
  const k = props.node.props?.relationKey
  return typeof k === 'string' ? k : undefined
})
const title = computed(() => localizeLabel(props.node.props?.title) || 'Related records')

function linkFor(item: RecordRefDto): string | null {
  return linkForRelated(useLayoutStore().get('nav', 'main')?.schema ?? null, item)
}

onMounted(async () => {
  if (ctx.recordId == null) {
    loading.value = false
    return
  }
  items.value = await loadRelated(ctx.recordId, relationKey.value)
  loading.value = false
})
</script>

<template>
  <div :style="sectionStyle">
    <h4 :style="sectionTitleStyle">{{ title }}</h4>
    <p v-if="loading">Loading…</p>
    <p v-else-if="items.length === 0">No related records.</p>
    <ul v-else style="margin: 0; padding-left: 1rem">
      <li v-for="it in items" :key="it.id">
        <NuxtLink v-if="linkFor(it)" :to="linkFor(it)!">{{ it.label }}</NuxtLink>
        <span v-else>{{ it.label }}</span>
      </li>
    </ul>
  </div>
</template>
