<script setup lang="ts">
// Create a deal — renders the `form` layout purely from schema. On save, go to the detail page.
import RecordForm from '~/components/record/RecordForm.vue'

const router = useRouter()

function onSaved(id: number): void {
  router.push(`/deals/${id}`)
}
</script>

<template>
  <main style="padding: 2rem; font-family: Inter, system-ui, sans-serif">
    <h1>New deal</h1>
    <p><NuxtLink to="/deals">← Deals</NuxtLink></p>
    <RecordForm entity-key="deal" @saved="onSaved" />
  </main>
</template>
