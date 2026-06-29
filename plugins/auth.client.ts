// Session bootstrap: on app start, rehydrate the token from localStorage and confirm it via /me
// (populating user + active tenant). Awaited so route middleware sees a resolved session.
import { useAuthStore } from '~/stores/useAuthStore'
import { useAbilityStore } from '~/stores/useAbilityStore'
import { authApi } from '~/lib/api/client'
import { loadAbilities } from '~/lib/abilities/abilities'
import { loadNav } from '~/lib/nav/loadNav'
import { readToken, clearToken } from '~/lib/auth/session'

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  const token = readToken()
  if (!token) return

  auth.setToken(token)

  try {
    const me = await authApi.me()
    auth.setUser({ id: me.user.id, email: me.user.email, name: me.user.name }, me.tenant_id)
    await loadAbilities() // hydrate op/ui perms + stage/field matrices for the active tenant
    await loadNav() // cache the resolved nav layout for dynamic routing + the menu
  }
  catch {
    auth.clear()
    useAbilityStore().clear()
    clearToken()
  }
})
