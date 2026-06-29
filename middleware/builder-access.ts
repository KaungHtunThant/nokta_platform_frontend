// Route guard for the builder: requires the ui.access-builder permission (decision #4 — builder is
// tenant-admin-and-above). UI-only gate; the API independently enforces op:manage.layouts on save.
import { useAbilityStore } from '~/stores/useAbilityStore'

export default defineNuxtRouteMiddleware(() => {
  if (!useAbilityStore().canSee('ui.access-builder')) {
    throw createError({ statusCode: 403, statusMessage: 'You do not have access to the builder.' })
  }
})
