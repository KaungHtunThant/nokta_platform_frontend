<script setup lang="ts">
// Catch-all VIEW: dynamic, config-driven routing. The resolved `nav` layout maps a slug to a nav
// entry { viewType, entityType, pipeline, layoutKey }; the view registry picks the collection view.
// A trailing id / `new` / `edit` (parseRecordRoute) renders the generic record detail/form for that
// entity — so ANY config-defined entity gets list + detail + create + edit with no per-entity pages.
// Access (ui.nav.*) is enforced by the `nav-guard` middleware before this renders.
import { computed } from 'vue'
import NavMenu from '~/components/nav/NavMenu.vue'
import RecordDetail from '~/components/record/RecordDetail.vue'
import RecordForm from '~/components/record/RecordForm.vue'
import { resolveNavEntry } from '~/lib/nav/navModel'
import { parseRecordRoute } from '~/lib/nav/recordRoute'
import { resolveViewType } from '~/lib/registries/viewRegistry'
import { useLayoutStore } from '~/stores/useLayoutStore'

definePageMeta({ middleware: 'nav-guard' })

const route = useRoute()
const router = useRouter()

const slug = computed(() => (Array.isArray(route.params.slug) ? route.params.slug.join('/') : String(route.params.slug ?? '')))
const parsed = computed(() => parseRecordRoute(slug.value))
const entry = computed(() => resolveNavEntry(useLayoutStore().get('nav', 'main')?.schema ?? null, parsed.value.navSlug))
const view = computed(() => (entry.value ? resolveViewType(entry.value.viewType) : undefined))

function onSelect(id: number): void {
  router.push(`/${parsed.value.navSlug}/${id}`)
}

function onSaved(id: number): void {
  router.push(`/${parsed.value.navSlug}/${id}`)
}
</script>

<template>
  <main style="padding: 2rem; font-family: Inter, system-ui, sans-serif">
    <NavMenu />

    <template v-if="entry">
      <RecordDetail
        v-if="parsed.mode === 'detail' && parsed.recordId !== null"
        :entity-key="entry.entityType"
        :record-id="parsed.recordId"
      />
      <RecordForm
        v-else-if="parsed.mode === 'create'"
        :entity-key="entry.entityType"
        @saved="onSaved"
      />
      <RecordForm
        v-else-if="parsed.mode === 'edit' && parsed.recordId !== null"
        :entity-key="entry.entityType"
        :record-id="parsed.recordId"
        @saved="onSaved"
      />
      <template v-else>
        <p v-if="entry.viewType === 'list'" style="margin: 0 0 0.5rem">
          <NuxtLink :to="`/${parsed.navSlug}/new`">+ New</NuxtLink>
        </p>
        <component :is="view" v-if="view" :entity-key="entry.entityType" @select="onSelect" />
      </template>
    </template>

    <p v-else>This view is not available.</p>
  </main>
</template>
