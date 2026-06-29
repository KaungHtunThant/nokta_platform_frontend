<script setup lang="ts">
// VIEW: live WYSIWYG preview of the draft, rendered through the SAME SurfaceRenderer the runtime
// uses — so what you build is what ships. Read-only context (no real record values).
import { computed } from 'vue'
import SurfaceRenderer from '~/components/render/SurfaceRenderer.vue'
import { provideSurfaceContext } from '~/lib/render/surfaceContext'
import { toFieldVm } from '~/lib/render/fieldVm'
import { useBuilderStore } from '~/stores/useBuilderStore'
import { useSchemaStore } from '~/stores/useSchemaStore'

const props = defineProps<{ entityKey: string }>()
const store = useBuilderStore()

const schema = computed(() => useSchemaStore().get(props.entityKey))

provideSurfaceContext({
  mode: 'detail',
  field: (key) => {
    const f = schema.value?.fields.find(x => x.key === key)
    return f ? toFieldVm(f) : undefined
  },
  getValue: () => null,
  setValue: () => {},
})
</script>

<template>
  <SurfaceRenderer v-if="store.root" :node="store.root" />
</template>
