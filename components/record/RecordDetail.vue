<script setup lang="ts">
// VIEW + host: provides the surface context (detail mode, read-only) and renders the `detail`
// layout through the same generic SurfaceRenderer as the form — proving one renderer, both surfaces.
// Phase 7: shows a locked (signed) badge + a sign/lock action gated on the record.lock op permission.
import { ref, reactive, onMounted } from 'vue'
import SurfaceRenderer from '~/components/render/SurfaceRenderer.vue'
import { provideSurfaceContext } from '~/lib/render/surfaceContext'
import { toFieldVm, type FieldVm } from '~/lib/render/fieldVm'
import { loadDetailSurface, lockRecord, unlockRecord } from './RecordDetail.utils'
import { useAbilityStore } from '~/stores/useAbilityStore'
import type { LayoutNode } from '~/types/schema'

const props = defineProps<{ entityKey: string, recordId: number }>()

const rootNode = ref<LayoutNode | null>(null)
const fieldsByKey = ref<Map<string, FieldVm>>(new Map())
const values = reactive<Record<string, unknown>>({})
const loading = ref(true)
const locked = ref(false)
const abilities = useAbilityStore()

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
  locked.value = Boolean(record.is_locked)
  loading.value = false
})

async function onLock(): Promise<void> {
  locked.value = await lockRecord(props.recordId)
}

async function onUnlock(): Promise<void> {
  locked.value = await unlockRecord(props.recordId)
}
</script>

<template>
  <section>
    <p v-if="loading">Loading…</p>
    <template v-else>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem">
        <span v-if="locked" style="font-size: 13px; color: #1f9d55">🔒 Signed / locked</span>
        <button
          v-if="!locked && abilities.canDo('record.lock')"
          type="button"
          @click="onLock"
        >
          Sign &amp; lock
        </button>
        <button
          v-if="locked && abilities.canDo('record.unlock')"
          type="button"
          @click="onUnlock"
        >
          Unlock
        </button>
      </div>
      <SurfaceRenderer v-if="rootNode" :node="rootNode" />
    </template>
  </section>
</template>
