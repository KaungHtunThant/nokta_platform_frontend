<script setup lang="ts">
// Deal detail — renders the `detail` layout purely from the same field definitions as the form.
import { computed } from 'vue'
import RecordDetail from '~/components/record/RecordDetail.vue'

const route = useRoute()
const id = computed(() => Number(route.params.id))
</script>

<template>
  <main style="padding: 2rem; font-family: Inter, system-ui, sans-serif">
    <h1>Deal #{{ id }}</h1>
    <p>
      <NuxtLink to="/deals">← Deals</NuxtLink>
      ·
      <NuxtLink :to="`/deals/${id}/edit`">Edit</NuxtLink>
    </p>
    <RecordDetail entity-key="deal" :record-id="id" />
  </main>
</template>
