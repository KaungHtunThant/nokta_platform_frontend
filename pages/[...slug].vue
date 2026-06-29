<script setup lang="ts">
// Catch-all VIEW: dynamic, config-driven routing. The resolved `nav` layout maps a slug to a nav
// entry { viewType, entityType, pipeline, layoutKey }; the view registry picks the page component.
// Access (ui.nav.*) is enforced by the `nav-guard` middleware before this renders.
import { computed } from 'vue'
import NavMenu from '~/components/nav/NavMenu.vue'
import { resolveNavEntry } from '~/lib/nav/navModel'
import { resolveViewType } from '~/lib/registries/viewRegistry'
import { useLayoutStore } from '~/stores/useLayoutStore'

definePageMeta({ middleware: 'nav-guard' })

const route = useRoute()
const router = useRouter()

const slug = computed(() => (Array.isArray(route.params.slug) ? route.params.slug.join('/') : String(route.params.slug ?? '')))
const entry = computed(() => resolveNavEntry(useLayoutStore().get('nav', 'main')?.schema ?? null, slug.value))
const view = computed(() => (entry.value ? resolveViewType(entry.value.viewType) : undefined))

function onSelect(id: number): void {
  router.push(`/${slug.value}/${id}`)
}
</script>

<template>
  <main style="padding: 2rem; font-family: Inter, system-ui, sans-serif">
    <NavMenu />
    <component
      :is="view"
      v-if="view && entry"
      :entity-key="entry.entityType"
      @select="onSelect"
    />
    <p v-else>This view is not available.</p>
  </main>
</template>
