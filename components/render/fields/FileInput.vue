<script setup lang="ts">
// Field input: `file` (form/edit mode). Uploads attach to an existing record, so the field is active
// only once the record is saved (recordId present in the surface context). Lists current files with
// a remove action. API access lives in FileField.utils.ts (eslint layer boundary).
import { ref, onMounted } from 'vue'
import type { FieldVm } from '~/lib/render/fieldVm'
import type { RecordFileDto } from '~/types/dto'
import { useSurfaceContextOptional } from '~/lib/render/surfaceContext'
import { loadFiles, uploadFile, removeFile } from './FileField.utils'

const props = defineProps<{ modelValue: unknown, field: FieldVm }>()

const ctx = useSurfaceContextOptional()
const files = ref<RecordFileDto[]>([])
const busy = ref(false)

onMounted(async () => {
  if (ctx?.recordId != null) files.value = await loadFiles(ctx.recordId, props.field.key)
})

async function onSelect(event: { files: File[] }): Promise<void> {
  const file = event.files[0]
  if (ctx?.recordId == null || !file) return
  busy.value = true
  try {
    files.value = await uploadFile(ctx.recordId, props.field.key, file)
  }
  finally {
    busy.value = false
  }
}

async function remove(file: RecordFileDto): Promise<void> {
  if (ctx?.recordId == null) return
  await removeFile(ctx.recordId, file.id)
  files.value = files.value.filter(f => f.id !== file.id)
}
</script>

<template>
  <div>
    <p v-if="ctx?.recordId == null" style="color: #6b7280; font-size: 13px">
      Save the record first to attach files.
    </p>
    <template v-else>
      <ul v-if="files.length" style="margin: 0 0 0.5rem; padding-left: 1rem">
        <li v-for="f in files" :key="f.id">
          <a :href="f.url" target="_blank" rel="noopener">{{ f.name }}</a>
          <button type="button" style="margin-left: 0.5rem" @click="remove(f)">remove</button>
        </li>
      </ul>
      <FileUpload
        mode="basic"
        :auto="true"
        :custom-upload="true"
        :disabled="busy"
        choose-label="Attach file"
        @select="onSelect"
      />
    </template>
  </div>
</template>
