<script setup lang="ts">
// VIEW + host: provides the surface context (form mode) and renders the `form` layout through the
// generic SurfaceRenderer. No entity-specific markup — any entity's form renders from its config.
import { ref, reactive, onMounted } from 'vue'
import SurfaceRenderer from '~/components/render/SurfaceRenderer.vue'
import { provideSurfaceContext } from '~/lib/render/surfaceContext'
import { toFieldVm, type FieldVm } from '~/lib/render/fieldVm'
import { loadFormSurface, submitForm } from './RecordForm.utils'
import { formStyle } from './RecordForm.design'
import type { LayoutNode } from '~/types/schema'

// `recordId` switches the form into edit mode: prefill from the record, submit as an update.
const props = defineProps<{ entityKey: string, recordId?: number }>()
const emit = defineEmits<{ saved: [id: number] }>()

const rootNode = ref<LayoutNode | null>(null)
const fieldsByKey = ref<Map<string, FieldVm>>(new Map())
const values = reactive<Record<string, unknown>>({})
const loading = ref(true)
const saving = ref(false)

provideSurfaceContext({
  mode: 'form',
  field: key => fieldsByKey.value.get(key),
  getValue: key => values[key],
  setValue: (key, value) => { values[key] = value },
})

onMounted(async () => {
  const { schema, layout, record } = await loadFormSurface(props.entityKey, props.recordId)
  fieldsByKey.value = new Map(schema.fields.map(f => [f.key, toFieldVm(f)]))
  rootNode.value = layout.schema
  if (record) Object.assign(values, record.data)
  loading.value = false
})

async function onSubmit(): Promise<void> {
  saving.value = true
  try {
    const record = await submitForm(props.entityKey, { ...values }, props.recordId)
    emit('saved', record.id)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <form :style="formStyle" @submit.prevent="onSubmit">
    <p v-if="loading">Loading…</p>
    <SurfaceRenderer v-else-if="rootNode" :node="rootNode" />
    <Button type="submit" :label="saving ? 'Saving…' : 'Save'" :disabled="loading || saving" />
  </form>
</template>
