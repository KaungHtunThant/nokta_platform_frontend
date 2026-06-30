<script setup lang="ts">
// Field display: `file` (detail mode). Lists the record's attachments for this field as download links.
// The file field's JSON value is empty; files live in medialibrary, fetched via the record's files map.
import { ref, onMounted } from 'vue'
import type { FieldVm } from '~/lib/render/fieldVm'
import type { RecordFileDto } from '~/types/dto'
import { useSurfaceContextOptional } from '~/lib/render/surfaceContext'
import { loadFiles } from './FileField.utils'

const props = defineProps<{ value: unknown, field: FieldVm }>()
const ctx = useSurfaceContextOptional()
const files = ref<RecordFileDto[]>([])

onMounted(async () => {
  if (ctx?.recordId != null) files.value = await loadFiles(ctx.recordId, props.field.key)
})
</script>

<template>
  <span v-if="files.length === 0">—</span>
  <ul v-else style="margin: 0; padding-left: 1rem">
    <li v-for="f in files" :key="f.id">
      <a :href="f.url" target="_blank" rel="noopener">{{ f.name }}</a>
    </li>
  </ul>
</template>
