<script setup lang="ts">
// Field display: `relation` (detail mode). Resolves the linked record's label and renders it as a
// link to that record's detail page (slug resolved from the nav layout). Read-only.
import { ref, computed, watch, onMounted } from 'vue'
import type { FieldVm } from '~/lib/render/fieldVm'
import type { RecordRefDto } from '~/types/dto'
import { fetchRecordRef } from './RelationField.utils'
import { slugForEntity } from '~/lib/nav/navModel'
import { useLayoutStore } from '~/stores/useLayoutStore'

const props = defineProps<{ value: unknown, field: FieldVm }>()

const target = ref<RecordRefDto | null>(null)

async function load(id: unknown): Promise<void> {
  if (id === null || id === undefined || id === '') {
    target.value = null
    return
  }
  try {
    target.value = await fetchRecordRef(Number(id))
  }
  catch {
    target.value = { id: Number(id), entity_type: null, label: `#${id}` }
  }
}

onMounted(() => load(props.value))
watch(() => props.value, load)

const to = computed<string | null>(() => {
  if (!target.value) return null
  const nav = useLayoutStore().get('nav', 'main')?.schema ?? null
  const entity = target.value.entity_type ?? props.field.targetEntityType
  const slug = entity ? slugForEntity(nav, entity) : null
  return slug ? `/${slug}/${target.value.id}` : null
})
</script>

<template>
  <span v-if="target">
    <NuxtLink v-if="to" :to="to">{{ target.label }}</NuxtLink>
    <span v-else>{{ target.label }}</span>
  </span>
  <span v-else>—</span>
</template>
