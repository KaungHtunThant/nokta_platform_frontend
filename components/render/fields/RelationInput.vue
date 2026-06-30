<script setup lang="ts">
// Field input: `relation`. Async record picker (PrimeVue AutoComplete) scoped to the field's target
// entity type. The bound value is the target record's id; we keep the selected {id,label} ref locally
// and emit just the id. API access lives in RelationField.utils.ts (eslint layer boundary).
import { ref, watch, onMounted } from 'vue'
import type { FieldVm } from '~/lib/render/fieldVm'
import type { RecordRefDto } from '~/types/dto'
import { searchRecords, fetchRecordRef } from './RelationField.utils'

const props = defineProps<{ modelValue: unknown, field: FieldVm }>()
const emit = defineEmits<{ 'update:modelValue': [unknown] }>()

const selected = ref<RecordRefDto | null>(null)
const suggestions = ref<RecordRefDto[]>([])

async function hydrate(id: unknown): Promise<void> {
  if (id === null || id === undefined || id === '') {
    selected.value = null
    return
  }
  if (selected.value?.id === Number(id)) return
  try {
    selected.value = await fetchRecordRef(Number(id))
  }
  catch {
    selected.value = { id: Number(id), entity_type: null, label: `#${id}` }
  }
}

onMounted(() => hydrate(props.modelValue))
watch(() => props.modelValue, hydrate)

async function complete(event: { query: string }): Promise<void> {
  suggestions.value = props.field.targetEntityType
    ? await searchRecords(props.field.targetEntityType, event.query)
    : []
}

function onChange(value: RecordRefDto | string | null): void {
  if (value && typeof value === 'object') {
    selected.value = value
    emit('update:modelValue', value.id)
  }
  else if (value === null || value === '') {
    selected.value = null
    emit('update:modelValue', null)
  }
}
</script>

<template>
  <AutoComplete
    :model-value="selected"
    :suggestions="suggestions"
    option-label="label"
    dropdown
    force-selection
    :placeholder="props.field.placeholder || 'Search…'"
    @complete="complete"
    @update:model-value="onChange"
  />
</template>
