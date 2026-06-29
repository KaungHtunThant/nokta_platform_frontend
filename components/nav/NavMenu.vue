<script setup lang="ts">
// VIEW: dynamic navigation. Renders the tenant's resolved `nav` layout through the same
// SurfaceRenderer used everywhere else — so each nav-item is automatically hidden when the role
// lacks its `ui.nav.*` permission. Renders nothing until a nav layout is loaded.
import { computed } from 'vue'
import SurfaceRenderer from '~/components/render/SurfaceRenderer.vue'
import { useLayoutStore } from '~/stores/useLayoutStore'
import { navMenuStyle } from './NavMenu.design'

const navNode = computed(() => useLayoutStore().get('nav', 'main')?.schema ?? null)
</script>

<template>
  <nav v-if="navNode" :style="navMenuStyle">
    <SurfaceRenderer :node="navNode" />
  </nav>
</template>
