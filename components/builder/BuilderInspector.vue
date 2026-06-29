<script setup lang="ts">
// VIEW: edit the selected node's binding, UI permission, and visibility condition. Writes flow
// through updateSelected (pure tree update + store); the .vue holds no tree logic.
import { computed } from 'vue'
import type { FieldDto } from '~/types/schema'
import { useBuilderStore } from '~/stores/useBuilderStore'
import { updateSelected } from '~/lib/builder/edits'
import { buildVisibleWhen } from './BuilderInspector.utils'
import { panelStyle, fieldStyle, inputStyle } from './builder.design'

defineProps<{ fields: FieldDto[] }>()
const store = useBuilderStore()
const sel = computed(() => store.selected)
const vw = computed(() => sel.value?.visibleWhen)

function onBinding(e: Event): void {
  const v = (e.target as HTMLSelectElement).value
  updateSelected({ binding: v ? { field: v } : undefined })
}

function onPermission(e: Event): void {
  const v = (e.target as HTMLInputElement).value.trim()
  updateSelected({ permission: v ? { ui: v } : undefined })
}

function applyVisibleWhen(field: string, op: string, value: string): void {
  updateSelected({ visibleWhen: buildVisibleWhen(field, op, value) })
}
</script>

<template>
  <section :style="panelStyle">
    <h4 style="margin: 0 0 8px">Inspector</h4>
    <p v-if="!sel" style="color: #6b7280">Select a node to edit it.</p>

    <template v-else>
      <p style="margin: 0 0 12px"><strong>{{ sel.type }}</strong> <code>{{ sel.id }}</code></p>

      <label :style="fieldStyle">
        Bound field
        <select :style="inputStyle" :value="sel.binding?.field ?? ''" @change="onBinding">
          <option value="">— none —</option>
          <option v-for="f in fields" :key="f.key" :value="f.key">{{ f.label }}</option>
        </select>
      </label>

      <label :style="fieldStyle">
        UI permission
        <input :style="inputStyle" :value="sel.permission?.ui ?? ''" placeholder="ui.section.financials" @input="onPermission">
      </label>

      <fieldset style="border: 1px solid #eef0f3; border-radius: 8px; padding: 8px; margin: 0">
        <legend style="font-size: 12px; color: #6b7280">Visible when</legend>
        <label :style="fieldStyle">
          Field
          <input :style="inputStyle" :value="vw?.field ?? ''" @input="applyVisibleWhen(($event.target as HTMLInputElement).value, vw?.op ?? 'eq', String(vw?.value ?? ''))">
        </label>
        <label :style="fieldStyle">
          Operator
          <select :style="inputStyle" :value="vw?.op ?? 'eq'" @change="applyVisibleWhen(vw?.field ?? '', ($event.target as HTMLSelectElement).value, String(vw?.value ?? ''))">
            <option v-for="op in ['eq', 'ne', 'gt', 'lt', 'in', 'contains']" :key="op" :value="op">{{ op }}</option>
          </select>
        </label>
        <label :style="fieldStyle">
          Value
          <input :style="inputStyle" :value="String(vw?.value ?? '')" @input="applyVisibleWhen(vw?.field ?? '', vw?.op ?? 'eq', ($event.target as HTMLInputElement).value)">
        </label>
      </fieldset>
    </template>
  </section>
</template>
