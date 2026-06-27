<script setup lang="ts">
// Catch-all VIEW: dynamic, config-driven routing. The resolved `nav` layout maps a slug to
// { viewType, entityType, pipeline, layoutKey }; a view registry picks the page component.
// Route gating on ui.nav.* happens in middleware (added in Phase 3). Logic stays in utils.
const route = useRoute()
const slug = computed(() => (Array.isArray(route.params.slug) ? route.params.slug.join('/') : ''))
</script>

<template>
  <main style="padding: 2rem; font-family: Inter, system-ui, sans-serif">
    <h2>Dynamic view</h2>
    <p>slug: <code>{{ slug }}</code></p>
    <p>Resolved from the tenant's nav layout + view registry (Phase 3).</p>
  </main>
</template>
