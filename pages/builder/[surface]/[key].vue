<script setup lang="ts">
// Builder page: edit a tenant layout via the same SurfaceRenderer (preview) + a structural outline,
// palette, and inspector. Draft → publish → rollback. Gated by ui.access-builder (middleware); the
// API re-checks op:manage.layouts on every save. Entity comes from ?entity=<key> (palette source).
import { ref, onMounted, computed } from 'vue'
import BuilderOutline from '~/components/builder/BuilderOutline.vue'
import BuilderPalette from '~/components/builder/BuilderPalette.vue'
import BuilderInspector from '~/components/builder/BuilderInspector.vue'
import BuilderPreview from '~/components/builder/BuilderPreview.vue'
import type { FieldDto } from '~/types/schema'
import type { LayoutVersionDto } from '~/types/dto'
import { loadForEdit, saveDraft, saveAndPublish, rollbackTo, loadVersions } from '~/lib/builder/builder'
import { useBuilderStore } from '~/stores/useBuilderStore'
import { layoutGridStyle, panelStyle, toolbarStyle, inputStyle, miniButtonStyle } from '~/components/builder/builder.design'

definePageMeta({ middleware: 'builder-access' })

const route = useRoute()
const store = useBuilderStore()

const surface = computed(() => String(route.params.surface ?? ''))
const key = computed(() => String(route.params.key ?? ''))
const entityKey = computed(() => String(route.query.entity ?? ''))

const fields = ref<FieldDto[]>([])
const versions = ref<LayoutVersionDto[]>([])
const status = ref('')

async function refreshVersions(): Promise<void> {
  versions.value = await loadVersions()
}

onMounted(async () => {
  fields.value = await loadForEdit(surface.value, key.value, entityKey.value)
  await refreshVersions()
})

async function onSave(): Promise<void> {
  status.value = `Saved draft v${await saveDraft()}`
  await refreshVersions()
}

async function onPublish(): Promise<void> {
  await saveAndPublish()
  status.value = 'Published'
  await refreshVersions()
}

async function onRollback(event: Event): Promise<void> {
  const version = Number((event.target as HTMLSelectElement).value)
  if (!version) return
  await rollbackTo(version)
  status.value = `Rolled back to v${version}`
  await refreshVersions()
}
</script>

<template>
  <main style="padding: 2rem; font-family: Inter, system-ui, sans-serif">
    <h1>Layout builder — {{ surface }}/{{ key }}</h1>

    <div :style="toolbarStyle">
      <button type="button" :style="miniButtonStyle" @click="onSave">Save draft</button>
      <button type="button" :style="miniButtonStyle" @click="onPublish">Publish</button>
      <select :style="inputStyle" @change="onRollback">
        <option value="">Rollback to…</option>
        <option v-for="v in versions" :key="v.version" :value="v.version">v{{ v.version }} {{ v.note ? `· ${v.note}` : '' }}</option>
      </select>
      <span v-if="store.dirty" style="color: #dd3636">● unsaved</span>
      <span style="color: #6b7280">{{ status }}</span>
    </div>

    <div :style="layoutGridStyle">
      <section :style="panelStyle">
        <BuilderPalette :fields="fields" />
      </section>

      <section :style="panelStyle">
        <h4 style="margin: 0 0 8px">Structure</h4>
        <BuilderOutline v-if="store.root" :node="store.root" />
      </section>

      <BuilderInspector :fields="fields" />
    </div>

    <section :style="{ ...panelStyle, marginTop: '24px' }">
      <h4 style="margin: 0 0 8px">Preview</h4>
      <BuilderPreview v-if="store.root" :entity-key="entityKey" />
    </section>
  </main>
</template>
