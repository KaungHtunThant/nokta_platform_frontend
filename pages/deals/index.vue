<script setup lang="ts">
// Deal list — a thin route shell. All rendering is config-driven via the generic RecordList.
import RecordList from '~/components/record/RecordList.vue'

const router = useRouter()

function open(id: number): void {
  router.push(`/deals/${id}`)
}
</script>

<template>
  <main style="padding: 2rem; font-family: Inter, system-ui, sans-serif">
    <h1>Deals</h1>
    <p><NuxtLink to="/deals/new">+ New deal</NuxtLink></p>
    <RecordList entity-key="deal" @select="open" />
  </main>
</template>
