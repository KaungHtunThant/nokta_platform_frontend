<script setup lang="ts">
// VIEW: UI only. Orchestration (API + mapping) lives in RecordList.utils.ts; styling in *.design.ts.
// Emits `select` with a record id; the page owns navigation (keeps the component route-agnostic).
// Filter/sort controls (Phase 4) are generated from the schema's filterable/sortable fields.
import { ref, onMounted } from 'vue'
import FilterSortBar from './FilterSortBar.vue'
import { loadList } from './RecordList.utils'
import type { RecordRowVm } from './RecordList.model'
import type { FieldDto } from '~/types/schema'
import { emptyQuery, type RecordQuery } from '~/lib/records/recordQuery'
import { listStyle, rowStyle, statusStyle } from './RecordList.design'

const props = defineProps<{ entityKey: string }>()
const emit = defineEmits<{ select: [id: number] }>()

const rows = ref<RecordRowVm[]>([])
const filterable = ref<FieldDto[]>([])
const sortable = ref<FieldDto[]>([])
const loading = ref(true)
const query = ref<RecordQuery>(emptyQuery())

async function reload(): Promise<void> {
  loading.value = true
  const view = await loadList(props.entityKey, query.value)
  rows.value = view.rows
  filterable.value = view.filterable
  sortable.value = view.sortable
  loading.value = false
}

function onQuery(next: RecordQuery): void {
  query.value = next
  void reload()
}

onMounted(reload)
</script>

<template>
  <div>
    <FilterSortBar
      v-if="filterable.length || sortable.length"
      :filterable="filterable"
      :sortable="sortable"
      @change="onQuery"
    />

    <div :style="listStyle">
      <p v-if="loading">Loading…</p>
      <p v-else-if="rows.length === 0">No records match.</p>
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
  </div>
</template>
