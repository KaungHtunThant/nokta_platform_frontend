<script setup lang="ts">
// VIEW + host: provides the surface context (detail mode, read-only) and renders the `detail`
// layout through the same generic SurfaceRenderer as the form — proving one renderer, both surfaces.
import { ref, reactive, onMounted } from 'vue'
import SurfaceRenderer from '~/components/render/SurfaceRenderer.vue'
import { provideSurfaceContext } from '~/lib/render/surfaceContext'
import { toFieldVm, type FieldVm } from '~/lib/render/fieldVm'
import { loadDetailSurface } from './RecordDetail.utils'
import type { LayoutNode } from '~/types/schema'

const props = defineProps<{ entityKey: string, recordId: number }>()

const rootNode = ref<LayoutNode | null>(null)
const fieldsByKey = ref<Map<string, FieldVm>>(new Map())
const values = reactive<Record<string, unknown>>({})
const loading = ref(true)

provideSurfaceContext({
  mode: 'detail',
  field: key => fieldsByKey.value.get(key),
  getValue: key => values[key],
  setValue: () => { /* detail is read-only */ },
  recordId: props.recordId,
})

onMounted(async () => {
  const { schema, layout, record } = await loadDetailSurface(props.entityKey, props.recordId)
  fieldsByKey.value = new Map(schema.fields.map(f => [f.key, toFieldVm(f)]))
  rootNode.value = layout.schema
  Object.assign(values, record.data)
  loading.value = false
})
</script>

<template>
  <section>
    <p v-if="loading">Loading…</p>
    <SurfaceRenderer v-else-if="rootNode" :node="rootNode" />
  </section>
</template>
