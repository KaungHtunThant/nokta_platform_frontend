<script setup lang="ts">
// VIEW: UI only. Orchestration (API + mapping) lives in RecordForm.utils.ts; styling in *.design.ts.
// Renders any entity's form purely from the config-driven field view-models. Typed event handlers
// keep the generic values bag strict (Record<string, unknown>) without `any`.
import { ref, onMounted } from 'vue'
import { loadForm, submitForm } from './RecordForm.utils'
import type { FormFieldVm } from './RecordForm.model'
import { formStyle, labelStyle } from './RecordForm.design'

const props = defineProps<{ entityKey: string }>()
const emit = defineEmits<{ saved: [id: number] }>()

const fields = ref<FormFieldVm[]>([])
const values = ref<Record<string, unknown>>({})
const loading = ref(true)

onMounted(async () => {
  fields.value = await loadForm(props.entityKey)
  loading.value = false
})

function set(key: string, value: unknown): void {
  values.value[key] = value
}

function asString(value: unknown): string {
  return value == null ? '' : String(value)
}

function inputType(type: string): string {
  if (type === 'number' || type === 'money') return 'number'
  if (type === 'date') return 'date'
  if (type === 'email') return 'email'
  return 'text'
}

async function onSubmit(): Promise<void> {
  const record = await submitForm(props.entityKey, values.value)
  emit('saved', record.id)
}
</script>

<template>
  <form :style="formStyle" @submit.prevent="onSubmit">
    <p v-if="loading">Loading…</p>
    <div v-for="f in fields" :key="f.key">
      <label :style="labelStyle">{{ f.label }}<span v-if="f.required"> *</span></label>

      <select
        v-if="f.type === 'select'"
        :value="asString(values[f.key])"
        @change="set(f.key, ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="o in f.options" :key="o.key" :value="o.key">{{ o.label }}</option>
      </select>

      <textarea
        v-else-if="f.type === 'textarea'"
        :value="asString(values[f.key])"
        @input="set(f.key, ($event.target as HTMLTextAreaElement).value)"
      />

      <input
        v-else-if="f.type === 'bool'"
        type="checkbox"
        :checked="Boolean(values[f.key])"
        @change="set(f.key, ($event.target as HTMLInputElement).checked)"
      >

      <input
        v-else
        :type="inputType(f.type)"
        :value="asString(values[f.key])"
        @input="set(f.key, ($event.target as HTMLInputElement).value)"
      >
    </div>

    <button type="submit">Save</button>
  </form>
</template>
