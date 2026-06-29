<script setup lang="ts">
// VIEW: filter + sort controls for a list surface, generated from the schema's filterable/sortable
// fields (no entity-specific code). Emits a RecordQuery on change; the list owns the re-fetch.
// Logic (operator choice, query assembly) lives in FilterSortBar.utils.ts.
import { reactive, ref } from 'vue'
import type { FieldDto } from '~/types/schema'
import type { RecordQuery } from '~/lib/records/recordQuery'
import { buildQuery, defaultOpFor } from './FilterSortBar.utils'
import { barStyle, labelStyle, controlStyle } from './FilterSortBar.design'

const props = defineProps<{ filterable: FieldDto[], sortable: FieldDto[] }>()
const emit = defineEmits<{ change: [query: RecordQuery] }>()

const values = reactive<Record<string, unknown>>({})
const sort = ref<string | null>(null)
const dir = ref<'asc' | 'desc'>('asc')

function apply(): void {
  emit('change', buildQuery({ ...values }, props.filterable, sort.value, dir.value))
}

function onFilter(key: string, event: Event): void {
  values[key] = (event.target as HTMLInputElement).value
  apply()
}

function onSort(event: Event): void {
  sort.value = (event.target as HTMLSelectElement).value || null
  apply()
}

function toggleDir(): void {
  dir.value = dir.value === 'asc' ? 'desc' : 'asc'
  apply()
}
</script>

<template>
  <div :style="barStyle">
    <label v-for="f in filterable" :key="f.key" :style="labelStyle">
      {{ f.label }} <small>({{ defaultOpFor(f.type) }})</small>
      <input :style="controlStyle" :type="['number', 'money', 'decimal'].includes(f.type) ? 'number' : 'text'" @input="onFilter(f.key, $event)">
    </label>

    <label v-if="sortable.length" :style="labelStyle">
      Sort by
      <select :style="controlStyle" @change="onSort">
        <option value="">—</option>
        <option v-for="f in sortable" :key="f.key" :value="f.key">{{ f.label }}</option>
      </select>
    </label>
    <button v-if="sortable.length" type="button" :style="controlStyle" @click="toggleDir">{{ dir }}</button>
  </div>
</template>
