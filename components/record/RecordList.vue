<script setup lang="ts">
// VIEW: UI only. Orchestration (API + mapping) lives in RecordList.utils.ts; styling in *.design.ts.
// Emits `select` with a record id; the page owns navigation (keeps the component route-agnostic).
import { ref, onMounted } from 'vue'
import { loadList } from './RecordList.utils'
import type { RecordRowVm } from './RecordList.model'
import { listStyle, rowStyle, statusStyle } from './RecordList.design'

const props = defineProps<{ entityKey: string }>()
const emit = defineEmits<{ select: [id: number] }>()

const rows = ref<RecordRowVm[]>([])
const loading = ref(true)

onMounted(async () => {
  rows.value = await loadList(props.entityKey)
  loading.value = false
})
</script>

<template>
  <div :style="listStyle">
    <p v-if="loading">Loading…</p>
    <p v-else-if="rows.length === 0">No records yet.</p>
    <button
      v-for="r in rows"
      v-else
      :key="r.id"
      type="button"
      :style="rowStyle"
      @click="emit('select', r.id)"
    >
      <strong>{{ r.title }}</strong>
      <span :style="statusStyle">{{ r.status }}</span>
    </button>
  </div>
</template>
