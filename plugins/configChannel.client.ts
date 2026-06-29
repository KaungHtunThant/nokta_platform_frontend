// After the session is resolved (auth.client runs first), subscribe to the tenant config channel so
// layout.published / field-definition.changed events live-refresh the schema + layout caches.
import { useAuthStore } from '~/stores/useAuthStore'
import { useConfigChannel } from '~/composables/useConfigChannel'

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  if (auth.tenantId != null) {
    useConfigChannel(auth.tenantId)
  }
})
