<script setup lang="ts">
// Deal board — a thin route shell. The kanban renders entirely from pipeline/stage config + the
// card layout; dragging a card moves it via the policy-enforced move endpoint.
import KanbanBoard from '~/components/board/KanbanBoard.vue'
</script>

<template>
  <main style="padding: 2rem; font-family: Inter, system-ui, sans-serif">
    <h1>Deals board</h1>
    <p><NuxtLink to="/deals">← Deals list</NuxtLink></p>
    <KanbanBoard entity-key="deal" />
  </main>
</template>
