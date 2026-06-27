<script setup lang="ts">
// Edit a deal — the same config-driven form, prefilled from the record. On save, return to detail.
import { computed } from 'vue'
import RecordForm from '~/components/record/RecordForm.vue'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

function onSaved(savedId: number): void {
  router.push(`/deals/${savedId}`)
}
</script>

<template>
  <main style="padding: 2rem; font-family: Inter, system-ui, sans-serif">
    <h1>Edit deal #{{ id }}</h1>
    <p><NuxtLink :to="`/deals/${id}`">← Back to deal</NuxtLink></p>
    <RecordForm entity-key="deal" :record-id="id" @saved="onSaved" />
  </main>
</template>
